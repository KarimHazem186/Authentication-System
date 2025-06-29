import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";
import PasswordReset from "./components/PasswordReset";
import ForgotPassword from "./components/ForgetPassword";
function App() {
  const [data,setData] =useState(false)

  const history = useNavigate()
  const {logindata,setLoginData} = useContext(LoginContext)
  
  const DashboardValid = async() => {
  
    let token = localStorage.getItem('usersdatatoken');
    // console.log(token);
    const res = await fetch("/validuser",{
        method:"GET",
        headers: {
           "Content-Type": "application/json",
           "Authorization":token 
        }
    });
    const data = await res.json();
    // console.log(data);
    if(data.status === 401||!data) {
      // console.log("error page redirect");
      // history('*')
      console.log("user not valid") 
    } else {
      console.log("user verify");
      setLoginData(data);
      history('/dashboard')
    }
  }  

  useEffect(()=>{
    setTimeout(()=>{
      DashboardValid()
      setData(true)
    },2000)
  },[])
  
  return (
        <>
        { 
          data ? ( 
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
                <Route path="*" element={<Error />} />
             </Routes>
            </>
          
           ) :  <Box sx={{ display: 'flex' ,justifyContent:"center",alignItems:"center",height:"100vh" }}>
                  Loading...&nbsp;  
                  <CircularProgress />
               </Box>

        } 
    </>
    )
}

export default App;