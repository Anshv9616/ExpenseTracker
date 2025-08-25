import React from 'react'
  
 import {BrowserRouter as Router,Routes,Route,Navigate}from "react-router-dom" 
 import Login from "./pages/Auth/Login"
 import SignUp from "./pages/Auth/SignUp"
 import Home from   "./pages/Auth/Dashboard/Home"
 import Income from "./pages/Auth/Dashboard/Income"
 import Expense from "./pages/Auth/Dashboard/Expense"
 import UserProvider from "./context/UserContext" 
 const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const App = () => {
  return (
     <UserProvider>
      <div>
           <Router>
               <Routes>
                   <Route path="/" element={<Root/>}/>
                   <Route path="/login" exact element={<Login/>}/>
                   <Route path="/signUp" exact element={<SignUp/>}/>
                    <Route path="/dashboard" exact element={<Home/>}/>
                     <Route path="/income" exact element={<Income/>}/>  
                       <Route path="/expense" exact element={<Expense/>}/>
               </Routes>
           </Router>
      </div>
      </UserProvider>
  )
}

export default App



