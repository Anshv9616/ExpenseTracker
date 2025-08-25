import React, { useState } from 'react'
import AuthLayout from "../../components/Inputs/layouts/AuthLayout"
import {Link, useNavigate} from "react-router-dom"
import INPUT from "../../components/Inputs/input"
import validateEmail from "../../utils/helper"
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
const Login = () => {
   const[email ,setEmail]=useState("");
   const[password ,setPassword]=useState("");
   const[error,setError]=useState("");
    const {updateUser}=useContext(UserContext)
   const navigate=useNavigate();
  
 const  handleLogin=async(e)=>{
   e.preventDefault()
   if(!validateEmail(email)){
         setError("Please enter a valid email address")
         return 
    }

    if(!password){
         setError("Please enter the password")
         return 
    }

    setError("")

    //login api call

   try {
    // Send a POST request to the login API endpoint
    // API_PATHS.AUTH.LOGIN contains the relative path (e.g., "/auth/login")
    // axiosInstance will automatically use the BASE_URL and headers from its config
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,     // User's email from the login form
        password   // User's password from the login form
    });

    // Destructure the token and user data from the server's response
    // The backend typically sends these if the login is successful
    const { token, user } = response.data;

    // If a token is returned, store it in localStorage
    // This allows the user to stay logged in even after refreshing the page
    // Also, your axios request interceptor will automatically attach this token
    // to the Authorization header in all future requests
    if (token) {
        localStorage.setItem("token", token);
        updateUser(user)
       // console.log(user);
        navigate("/dashboard")
    }

    // You might also want to store user info in state or localStorage
    // so you can display the username, role, etc. in the UI
    // Example: localStorage.setItem("user", JSON.stringify(user));

} catch (error) {
    // If the request fails, check if we got an error response from the server
    if (error.response && error.response.data.message) {
        // Show the backend's error message (e.g., "Invalid email or password")
        setError(error.response.data.message);
    } else {
        // If no server response (network error, timeout, etc.), show a generic error
        setError("something went wrong");
    }
}

      
 }
  return (
    <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
          <h3 className='text-xl font-semibold '>Welcome Back</h3>
          <p className='text-xs text-slate-700 mt-1.5 mb-6'> Please enter your details to log in</p>
        

        <form onSubmit={handleLogin}>
            <INPUT type="text" 
                value={email} 
                onChange={({target})=>{
                      setEmail(target.value)
                }}
                label="email Address"
                placeholder='enter your email'
                
                />

                 <INPUT type="password" 
                value={password} 
                onChange={({target})=>{
                      setPassword(target.value)
                }}
                label="Password"
                placeholder='enter your password'
                
                />


                {
                  error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>
                }

                <button type='submit' className='btn-primary'> Login</button>

                <p className='text-[13px] text-slate-800 mt-3'>
                    Don't have an account ?{""}
                    <Link to="/signUp" className='text-primary underline font-medium'>
                      SignUp
                      </Link>
                </p>
        </form>
        </div>
    </AuthLayout>
  )
}

export default Login