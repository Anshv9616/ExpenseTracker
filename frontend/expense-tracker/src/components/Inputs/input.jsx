import React, { useState } from 'react';
// Icons for showing/hiding password
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


const Input = ({ value, onChange, type, label, placeholder }) => {
  // State to track whether the password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);

  // Toggle function for password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      {/* Label for the input */}
      <label className='text-xs text-slate-800'>{label}</label>

      <div className='input-box'>
        {/* 
          If type is "password", decide based on showPassword state
          Otherwise, just use the given type
        */}
        <input
          type={type === 'password' ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          value={value}
          onChange={(e) => {
            onChange(e);
          }}
        />

        {/* If the type is password, show an icon to toggle visibility */}
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
