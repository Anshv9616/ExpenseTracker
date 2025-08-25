const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  //  console.log("hii")
    const token= req.header("Authorization")?.replace("Bearer", "").trim();

  //  console.log(token)

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Verify token
       // console.log("Hii")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       // console.log("hii")
      //  console.log(decoded)
          
        // Get user and exclude password
        req.user = await User.findById(decoded.id).select('-password');

      

        next();
    } catch (err) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

//Middleware to authenticate user using JWT
// exports.protect = (req, res, next) => {
//     try {
//         // Extract JWT token from body, cookies, or Authorization header
//         // Authorization header should be in the format: "Bearer <token>"
//         console.log("hii")
//         const token = req.body.token  || req.header("Authorization")?.replace("Bearer", "").trim();
//         console.log(token)
//         // If no token is provided, deny access
//         if (!token || token === undefined) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Token Missing"
//             });
//         }

//         try {
//             // Verify token using secret key and extract payload
//             const decode = jwt.verify(token, process.env.JWT_SECRET);
//             console.log(decode); // Optional: log decoded payload for debugging

//             // Attach the decoded user information to the request object
//             req.user = decode;
//         } catch (error) {
//             // If token is invalid or expired
//             return res.status(401).json({
//                 success: false,
//                 message: "Token is invalid"
//             });
//         }

//         // Proceed to next middleware or route handler
//         next();
//     } catch (error) {
//         // Catch-all for any unexpected errors
//         return res.status(401).json({
//             success: false,
//             message: "Something went wrong during authentication"
//         });
//     }
// };

