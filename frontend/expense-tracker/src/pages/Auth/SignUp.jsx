import React ,{useState} from 'react'
import AuthLayout from "../../components/Inputs/layouts/AuthLayout"
import {Link, useNavigate} from "react-router-dom"
import INPUT from "../../components/Inputs/input"
import validateEmail from "../../utils/helper"
import ProfilePhotoSelector from"../../components/Inputs/ProfilePhotoSelector"
import { FaRegObjectUngroup } from 'react-icons/fa6'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apiPaths'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage'
const SignUp = () => {
   const [profilePic ,setProfilePic]=useState("");
   const [fullName,setFullName]=useState("");
   const [email,setEmail]=useState("");
   const [password ,setPassword]=useState("");

   const [error,setError]=useState(null);
  const {updateUser}=useContext(UserContext)
   const navigate=useNavigate();

   const handleSignUp=async(e)=>{
      e.preventDefault();
      let profileImageUrl="";

      if(!fullName){
         setError("Please enter your name")
         return 
      }
      if(!validateEmail(email)){
         setError("Please enter a valid email")
         return 
      }
      if(!password){
         setError("Please enter your password")
         return 
      }

      setError("");

      //signup api call

      try{

            if(profilePic){
                const imgUploadRes=await uploadImage(profilePic);
                profileImageUrl=imgUploadRes.imageUrl || "";
            }
           const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
                 fullName,
                 email,
                 password,
                 profileImageUrl
           })

           const {token,user}=response.data;

           if(token){
             localStorage.setItem("token",token);
             updateUser(user)
             navigate("/dashboard");
           }
      }
      catch(err){
          if (error.response && error.response.data.message) {
      
        setError(error.response.data.message);
    } else {
      
        setError("something went wrong");
    }
      }
         
   }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold '>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-1.5 mb-6'>Join us today by entering your detail below </p>

         <form onSubmit={handleSignUp}>
           
           <div className='flex justify-center items-center'> <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}></ProfilePhotoSelector></div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

               <INPUT
            value={fullName}
            type="text"
            onChange={({target})=>setFullName(target.value)}
            label="Full name"
            placeholder="Enter Full Name"
              
              />

             <INPUT type="text" 
                value={email} 
                onChange={({target})=>{
                      setEmail(target.value)
                }}
                label="Email Address"
                placeholder='enter your email'
                
                />

                 <INPUT type="Password" 
                value={password} 
                onChange={({target})=>{
                      setPassword(target.value)
                }}
                label="Password"
                placeholder='enter your password'
                
                />


              </div>

                {
                                error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>
                              }
              
                              <button type='submit' className='btn-primary'>SIGN UP</button>
              
                              <p className='text-[13px] text-slate-800 mt-3'>
                                   Already have an account  ?{""}
                                  <Link to="/login" className='text-primary underline font-medium'>
                                    Login
                                    </Link>
                              </p>
         </form>

        
      </div>

    </AuthLayout>
  )
}

export default SignUp