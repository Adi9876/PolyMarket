import React from 'react';

const MarketList = ({ markets, onSelect }: { markets: any, onSelect: any }) => {

  // console.log("inside marketlist ",markets[i][2]);

  const isRes: any[] = [];
  for(let i=0; i<markets.length;i++){
    isRes.push(markets[i][2]);
  }

  return (
    <div className='p-2'>
      <div className='flex justify-center'><h2>Markets</h2></div>
      <ul className='flex flex-wrap mt-5 '>
        {markets.map((market: any, index: any) => ( 
          <li className={isRes[index] ?"notresolved":"resolved"} key={index} onClick={() => onSelect(market)}>
            id-{market.id} <br/> {market[0]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketList;
