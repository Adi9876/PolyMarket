import { useState } from 'react';

const CreateMarket = ({ contract, signer }: { contract: any, signer: any }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState('');
  const [resolutionTime, setResolutionTime] = useState('');

  const handleCreateMarket = async () => {

    try {
      const optionsArray = options.split(',').map(option => option.trim());
      console.log(contract.interface)
      const times = Math.floor(new Date(resolutionTime).getTime() / 1000);
      const tx = await contract.createMarket(question, optionsArray, times);
      await tx.wait();
      window.location.reload();
    }
    catch (error) {
      alert("Problem creating market! ");
      console.log("Problem creating market ", error);
    }
  };

  return (<div className='w-full flex justify-center'>
    <div className=' w-1/4 p-4'>
      <h2>Create Market</h2>
      <input className='w-full text-gray-900 p-1 mb-1' type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <input className='w-full text-gray-900 p-1 mb-1' type="text" placeholder="Options (comma separated)" value={options} onChange={(e) => setOptions(e.target.value)} />
      <input className='w-full text-gray-900 p-1' type="datetime-local" placeholder="Resolution Time" value={resolutionTime} onChange={(e) => setResolutionTime(e.target.value)} />
      <button className='mt-2' onClick={handleCreateMarket}>Create Market</button>
    </div>
  </div>
  );
};

export default CreateMarket;
