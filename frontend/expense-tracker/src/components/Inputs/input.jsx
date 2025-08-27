import React, { useState } from 'react';

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


const Input = ({ value, onChange, type, label, placeholder }) => {
 
  const [showPassword, setShowPassword] = useState(false);

  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      
      <label className='text-xs text-slate-800'>{label}</label>

      <div className='input-box'>
       
        
        <input
          type={type === 'password' ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          value={value}
          onChange={(e) => {
            onChange(e);
          }}
        />

        
        {type === "password" && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className='text-purple-500 cursor-pointer'
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className='text-purple-500 cursor-pointer'
                onClick={toggleShowPassword}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
