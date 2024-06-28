// pragma solidity >0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract Token is ERC20{

//     constructor() ERC20("My Token","MYT"){
//         _mint(msg.sender, 100 * (10**decimals()));
//     }

// }

// SPDX-License-Identifier: MIT
pragma solidity >0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("My Token", "MYT") {
        _mint(msg.sender, 10 * (10 ** decimals()));
    }

    function getToken(uint256 _amount) public {
        _mint(msg.sender, _amount * (10 ** decimals()));
    }
}
