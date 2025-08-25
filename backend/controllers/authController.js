
const User =require("../models/User")
const jwt=require("jsonwebtoken")

const generateToken=(id)=>{
         return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1h"})
}
// register user
exports.registerUser=async(req,res)=>{
        const{fullName,email,password ,profileImageUrl}=req.body;

        //validation
        if(!fullName ||!email ||!password){
               return res.status(400).json({message:"all field are required"})
        }

        try{
              //check if email exist

              const exisitingUser=await User.findOne({email});

              if(exisitingUser){
                res.status(400).json({
                   message:"user already exists"
              })}

              //create user
              const user=await User.create({
                   fullName,
                   email,
                   password,
                   profileImageUrl,
              })

               res.status(201).json({
                      id:user._id,
                      user,
                      token:generateToken(user._id)
            })

        }
           
           
        catch(err){
             res.status(401).json({
                   message:"error while registering  user",
                   error:err.message,
                   
             })
        }
  }

    // login user
exports.loginUser=async(req,res)=>
{
    
       //destructure
       const {email,password}=req.body;
       if(!email ||!password){
       return  res.status(400).json({
             message:"fill all fields"
         })
       }

       try{
             const user=await User.findOne({email});
             if(!user || !(await user.comparePassword(password))){
                 return   res.status(400).json({
                       message:"invalid credentials"
                   })
             }

             res.status(200).json({
                id:user._id,
                user,
                token:generateToken(user._id)
             })
       }
       catch(err){
               
                 res.status(401).json({
                   message:"error while  login ",
                   error:err.message,
                   
             })
       }

         
        
}

// get user info
exports.getUserInfo=async(req,res)=>
{
       try{
            const user=await User.findById(req.user.id).select("-password");
            if(!user){
                  return res.status(400).json({
                       message:"User not found "
                  })
            }

            res.status(200).json({
                 message:"hii",
                 user
            })
       }
       catch(err){
             
            res.status(401).json({
                   message:"error while fetching user ",
                   error:err.message,
                   
             })

       }
        
}

