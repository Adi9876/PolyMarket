import { useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";

import tokencontractAbi from '../../artifacts/contracts/Token.sol/Token.json'; // Assuming ABI is stored here

// const CONTRACT_ADDRESS = '0x8D27346f993a3cd0373641Fd9959777fA81F30c5';
// const TOKEN_ADDRESS = "0xE1947Dd06C181ff6857E5B236a83E0A04dd0E1C9";

// just with holsky 3 opotions
// const CONTRACT_ADDRESS = "0xD8299478cd7C5e2fe638Fc6dBAf32349B00FB491";
// const TOKEN_ADDRESS = "0xAe8A4880A1070D2BECcea2f86aAF3bf920c40fBb"

const CONTRACT_ADDRESS = "0x1222b664d3E4265905032199F56470daB4B917f8"
const TOKEN_ADDRESS = "0x00FE65a66a90092d592B6F3EF9caD7A5B460A168"

const MarketDetail = ({ market, contract }: { market: any, contract: any }) => {
  const [betAmount, setBetAmount] = useState('');
  const [betOption, setBetOption] = useState('');
  const [winningOption, setWinningOption] = useState('');

  // console.log("yo",market);
  // console.log("contract: ",contract);

  console.log(typeof (market[1]))

  const marketid = Number(market.id);

  const handlePlaceBet = async () => {
    try {
      const amount = ethers.parseUnits(betAmount, 18);

      // for setting allowance for my token

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect()
      const provider: any = new ethers.BrowserProvider(connection);

      // await provider.send('eth_requestAccounts', []);

      const signer: any = await provider.getSigner();
      const spender: any = await signer.getAddress();
      const tokenContract: any = new ethers.Contract(TOKEN_ADDRESS, tokencontractAbi.abi, signer);
      console.log("token contract ", tokenContract);
      const txn = await tokenContract.approve(CONTRACT_ADDRESS, amount);
      await txn.wait();
      console.log("txn ", txn);

      const txn1 = await tokenContract.getToken(amount);
      await txn1.wait();
      console.log("txn1 ", txn1);


      console.log("approval set");


      //////////////


      console.log(market);
      const tx = await contract.placeBet(market.id, betOption, amount);
      await tx.wait();
      window.location.reload();

    }
    catch (error: any) {
      alert(error.reason);
      console.log("in handle place bet: ", error);
    }
  };

  const handleResolveMarket = async () => {
    try {
      const tx = await contract.finalizeMarket(market.id, winningOption);
      await tx.wait();
      window.location.reload();
    }
    catch (error: any) {
      alert(error.reason);
      console.log("in handleresolvemarket: ", error);
    }
  };

  const handleClaimWinnings = async () => {
    try {
      const tx = await contract.claimWinnings(market.id);
      await tx.wait();
      window.location.reload();
    } catch (error: any) {
      alert(error.reason);
      console.log("in handle claim winnings: ", error);
    }
  };

  const handleRequest = async () => {
    try {
      const txn = await contract.requestResolution(marketid);
      await txn.wait();
      window.location.reload();
    } catch (error: any) {
      alert(error.reason);
      console.log("in handle request: ", error.reason);
    }
  }

  // const test = async () => {

  //   const web3Modal = new Web3Modal();
  //   const connection = await web3Modal.connect()
  //   const provider: any = new ethers.BrowserProvider(connection);

  //   await provider.send('eth_requestAccounts', []);

  //   const signer: any = await provider.getSigner();
  //   const spender: any = await signer.getAddress();

  //   const test1 = await contract.getOptionBets(marketid, 1);
  //   const test2 = await contract.getUserBets(marketid,1);
  //   console.log("test", test1,test2);

  // }

  return (
    <div className='border border-gray-100 w-1/3'>
      <h2>Market Details of id-{marketid}</h2>
      <div className='mt-2'>
        <div className='border-b border-gray-100 p-2'><p>Question: {market[0]}</p>
          <p>Resolution Time: {new Date(Number(market[1]) * 1000).toLocaleString()}</p>
          <p>Options: {market.options.join(', ')}</p>
        </div>

        <div className='border-b border-gray-100 p-2 '>
          <h3>Place Bet</h3>
          <input placeholder="Option starting from 0" value={betOption} onChange={(e) => setBetOption(e.target.value)} className='text-gray-900' />
          <input placeholder="Amount" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} className='text-gray-900 ml-2' />
          <button onClick={handlePlaceBet}>Place Bet</button>
        </div>

        <div className='mt-1 border-b border-gray-100 p-2'><h3>Request Resolution</h3>
          <button onClick={handleRequest}>Request</button>
        </div>

        <div className='border-b border-gray-100 p-2'><h3>Resolve Market</h3>
          <input type="text" placeholder="Winning Option" value={winningOption} onChange={(e) => setWinningOption(e.target.value)} className='mr-2 text-gray-900' />
          <button onClick={handleResolveMarket}>Resolve Market</button>
          {/* <button onClick={test}>Test</button> */}
          </div>

        <div className='border-b border-gray-100 p-2'>
          <button onClick={handleClaimWinnings}>Claim Winnings</button>
        </div>
      </div>
    </div>

  );
};

export default MarketDetail;
