import React, { useContext, useEffect, useState } from 'react'
import proxyImage from './proxy-image.png';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function Dashboard() {
  const {logindata,setLoginData} = useContext(LoginContext)
  // console.log(logindata)
  //  console.log(logindata.ValidUserOne)

  //  const [verifyLoginData,setVerifyLoginData] = useState(false)


  const [data,setData] =useState(false)



  const history=useNavigate();
  
  const DashboardValid = async() => {
  
    let token = localStorage.getItem('usersdatatoken');
    // console.log(token);
    const res = await fetch("/validuser",{
        method: "GET",
        headers: {
           "Content-Type": "application/json",
           "Authorization":token 
        }
    });
    const data = await res.json();

    // console.log("dashData",data);
    if(data.status === 401||!data) {
      // console.log("error page redirect");
      history('*')
    } else {
      // setVerifyLoginData(true)
      console.log("user verify");
      setLoginData(data);
      history('/dashboard')
    }
  }
  // useEffect(()=>{
  //   DashboardValid();
  // },[])

  useEffect(()=>{
    setTimeout(()=>{
      DashboardValid()
      setData(true)
    },2000)
  }, [])
  
    
  
  return (
    <>
    {
        data ?
        <div style={{display: 'flex', flexDirection: "column",alignItems: "center"}}>
        <img src={proxyImage} style={{width:"300px",marginTop:50}} alt='' />
        {/* <h1 style={{marginTop:80}} >User Email:karim@gmail.com</h1> */}
        <h1 style={{marginTop:80}} >User Email: {logindata ? /*verifyLoginData &&*/ logindata.ValidUserOne.email :""}</h1>
      </div> 
      : 
      <Box sx={{ display: 'flex' ,justifyContent:"center",alignItems:"center",height:"100vh" }}>
            Loading...   
            <CircularProgress />
      </Box>     
    }
      
    </>
  )
}
export default Dashboard
