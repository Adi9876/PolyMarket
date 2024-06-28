import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MarketList from './components/MarketList';
import CreateMarket from './components/CreateMarket';
import MarketDetail from './components/MarketDetail';
import contractAbi from '../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json';
import Web3Modal from "web3modal";


const CONTRACT_ADDRESS = "0x1222b664d3E4265905032199F56470daB4B917f8";


export default function Home() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState("");
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const init = async () => {

      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect()
        const provider: any = new ethers.BrowserProvider(connection);

        const signer: any = await provider.getSigner()
        const contract: any = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

        setProvider(provider);
        setSigner(signer);
        setContract(contract);

        console.log(contract);

        const marketCount = await contract.marketCount();
        const marketPromises = [];
        for (let i = 0; i < marketCount; i++) {
          let x = await contract.markets(i);
          const y = await contract.getMarketOptions(i);

          //from gpt
          const _options = Object.values(y).filter(value => typeof value === 'string');

          // console.log("type: ",_options);
          // console.log("x here:",x);
          x = Object.values(x);
          x.id = i;
          x.options = _options;

          marketPromises.push(x);

        }

        // const marketResults: any = await contract.markets(0);
        // console.log(marketResults)
        const marketResults: any = await Promise.all(marketPromises);
        // console.log("Here are market result: ",marketResults);
        setMarkets(marketResults);
        setloading(false);
      } catch (error) {
        alert(error);
        console.log("NONE", error);
      }
    };
    init();
  }, []);

  const handleMarketSelect = (market: any) => {
    // console.log("selected market",market);
    setSelectedMarket(market);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full p-4 flex-grow">
        <div>
          <CreateMarket contract={contract} signer={signer} />
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500"></div>
          ) : (
            <MarketList markets={markets} onSelect={handleMarketSelect} />
          )}
          {selectedMarket && <MarketDetail market={selectedMarket} contract={contract} />}
        </div>
      </div>
      <footer className="flex justify-center p-4">
        Check out the code at &#160;
        <a href="https://www.github.com/Adi9876" className="text-blue-400">
          Github
        </a>
      </footer>
    </div>
  );
}
