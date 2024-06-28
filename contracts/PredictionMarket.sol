// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uma/core/contracts/optimistic-oracle-v2/interfaces/OptimisticOracleV2Interface.sol";

contract PredictionMarket {
    OptimisticOracleV2Interface public oracle;
    IERC20 public collateralToken;

    struct Market {
        string question;
        string[] options;
        uint256 resolutionTime;
        bool resolved;
        uint256 winningOption;
        mapping(uint256 => uint256) optionBets;
        mapping(address => mapping(uint256 => uint256)) userBets;
    }

    mapping(uint256 => Market) public markets;
    uint256 public marketCount;

    event MarketCreated(
        uint256 indexed marketId,
        string question,
        string[] options,
        uint256 resolutionTime
    );
    event BetPlaced(
        uint256 indexed marketId,
        address indexed user,
        uint256 option,
        uint256 amount
    );
    event MarketResolved(uint256 indexed marketId, uint256 winningOption);
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );

    constructor(address _oracle, address _collateralToken) {
        oracle = OptimisticOracleV2Interface(_oracle);
        collateralToken = IERC20(_collateralToken);
    }

    function createMarket(
        string memory question,
        string[] memory options,
        uint256 resolutionTime
    ) external {
        require(options.length > 1, "At least two options required");
        require(
            resolutionTime > block.timestamp,
            "Resolution time must be in the future"
        );

        Market storage market = markets[marketCount];
        market.question = question;
        market.options = options;
        market.resolutionTime = resolutionTime;

        emit MarketCreated(marketCount, question, options, resolutionTime);
        marketCount++;
    }

    function placeBet(
        uint256 marketId,
        uint256 option,
        uint256 amount
    ) external {
        Market storage market = markets[marketId];
        require(
            block.timestamp < market.resolutionTime,
            "Betting period is over"
        );
        require(option < market.options.length, "Invalid option");

        collateralToken.transferFrom(msg.sender, address(this), amount);
        market.optionBets[option] += amount;
        market.userBets[msg.sender][option] += amount;

        emit BetPlaced(marketId, msg.sender, option, amount);
    }

    function requestResolution(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(!market.resolved, "Market already resolved");
        require(
            block.timestamp >= market.resolutionTime,
            "Market not ready for resolution"
        );

        bytes32 identifier = keccak256(abi.encodePacked("YES_OR_NO_QUERY"));
        bytes memory ancillaryData = abi.encodePacked(market.question);
        uint256 requestTime = block.timestamp;

        oracle.requestPrice(
            identifier,
            requestTime,
            ancillaryData,
            collateralToken,
            0
        );

        oracle.settle(address(this), identifier, requestTime, ancillaryData);

        int256 resolvedPrice = oracle
            .getRequest(address(this), identifier, requestTime, ancillaryData)
            .resolvedPrice;

        uint256 winningOption = resolvedPrice == 1 ? 1 : 0;

        market.resolved = true;

        market.winningOption = winningOption;

        emit MarketResolved(marketId, winningOption);
    }

    function claimWinnings(uint256 marketId) external {
        Market storage market = markets[marketId];
        require(market.resolved, "Market not resolved");

        uint256 userBetAmount = market.userBets[msg.sender][
            market.winningOption
        ];

        require(userBetAmount > 0, "No winnings to claim");

        uint256 totalBets = market.optionBets[market.winningOption];
        uint256 winnings = (userBetAmount *
            collateralToken.balanceOf(address(this))) / totalBets;

        collateralToken.transfer(msg.sender, winnings);

        market.userBets[msg.sender][market.winningOption] = 0;

        emit WinningsClaimed(marketId, msg.sender, winnings);
    }

    // for testing

    function finalizeMarket(uint256 marketId, uint256 winningOption) external {
        Market storage market = markets[marketId];
        require(market.resolved == false, "Market already resolved");

        market.resolved = true;
        market.winningOption = winningOption;

        emit MarketResolved(marketId, winningOption);
    }

    function getMarketOptions(
        uint256 marketId
    ) public view returns (string[] memory) {
        return markets[marketId].options;
    }

    function getOptionBets(
        uint256 marketId,
        uint256 optionId
    ) external view returns (uint256) {
        return markets[marketId].optionBets[optionId];
    }

    function getUserBets(
        uint256 marketId,
        uint256 optionId
    ) external view returns (uint256) {
        return markets[marketId].userBets[msg.sender][optionId];
    }
}
