require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const HOLESKY_URL = process.env.HOLESKY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
    }, 
    holesky: {
      url: HOLESKY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
