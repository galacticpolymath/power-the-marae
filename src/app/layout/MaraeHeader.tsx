import React from 'react';

const MaraeHeader: React.FC = () => (
  <div className="w-full flex flex-col justify-center items-center">
    <h1 className="text-4xl p-4">Light Up the Marae</h1>
    <div
      style={{
        height: '9px',
        width: '80%',
        background:
          'linear-gradient(90deg, rgba(18,6,55,1) 0%, rgba(42,12,69,1) 33%, rgba(255,241,215,1) 66%, rgba(23,7,58,1) 100%)',
      }}
    ></div>
    <div className="text-xl mt-2">visualizing energy mixes to power small communities</div>
  </div>
);

export default MaraeHeader;