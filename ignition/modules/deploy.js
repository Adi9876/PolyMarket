const hre = require("hardhat");

async function main() {

  const Token = await hre.ethers.deployContract("Token");
  await Token.waitForDeployment();
  const tokenAddress = Token.target;
  console.log("Token deployed to:", tokenAddress);

  // for sepolia 
  // const PredictionMarket = await hre.ethers.deployContract("PredictionMarket", ["0xabd7a46Abb93c998B19D57A2C82773Fa74fCe180",tokenAddress], {});
  
  // for holesky
  const PredictionMarket = await hre.ethers.deployContract("PredictionMarket", ["0xbDBB78Cf8eb48836844302b34b0b71cf233377C4",tokenAddress], {});
  await PredictionMarket.waitForDeployment();
  const predictionMarketAddress = PredictionMarket.target;
  console.log("PRediction Market deployed to: ", predictionMarketAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


