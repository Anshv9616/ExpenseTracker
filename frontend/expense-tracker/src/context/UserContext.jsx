
// import React,{createContext,useState} from "react";


//  export const UserContext =createContext();
// export const UserProvider =({children})=>{
        
//     const [user,setUser]=useState(null);
      
     
//     const updateUser=(userData)=>{
//             setUser(userData);
//     }


//     const clearUser=()=>{
//            setUser(null);
//     }

//     return (
//           <UserContext.Provider
//            value={{
//                 user,
//                 updateUser,
//                 clearUser
//            }}
//            >
//              {children}
//           </UserContext.Provider>
//     )

       
// }

// export default UserProvider

import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on first render
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data)); 
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider