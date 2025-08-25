import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className={"flex items-center p-6  shadow-md border border-gray-200 text-white rounded-2xl bg-white"}
    >
      {/* Icon section */}
      <div 
      
      className={`w-14 h-14 flex items-center justify-center px-auto color text-[26px] rounded-full mr-3 text-white ${color}`}>
        {icon}
      </div>

      {/* Text section */}
      <div>
        <p className="text-sm opacity-90 text-gray-500 mb-1">{label}</p>
        <h2 className="text-2xl font-bold text-black">₹{value}</h2>
      </div>
    </div>
  );
};

export default InfoCard;

