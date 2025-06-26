import React, { useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import './header.css'
import { LoginContext } from './ContextProvider/Context';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink, useNavigate } from 'react-router-dom';


const Header = () => {
  const {logindata,setLoginData} = useContext(LoginContext)
  // console.log(logindata)
  //  console.log(logindata.ValidUserOne)
  // const [verifyLoginData,setVerifyLoginData] = useState(false)

  const history = useNavigate()


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutuser = async()=> {
    let token = localStorage.getItem("usersdatatoken")

    const res = await fetch("/logout",{
      method: "GET",
      headers: {
        "Content-Type":"application/json",
        "Authorization":token,
        Accept:"application/json"
      },
      credentials:"include"
    });
    const data = await res.json();
    console.log(data);
    if(data.status === 201) {

      console.log("use logout");
      localStorage.removeItem("usersdatatoken")
      setLoginData(false)
      history("/");

    } else {
      console.log("error")
    }
  }

  

  const getDash = ()=> {
    history('/dashboard')
    // setVerifyLoginData(true)
  }

  const getError=()=> {
    history('*')
  }

  return (
    <>
        <header>
            <nav>
            <NavLink to="/"><h1>HP Cloud</h1></NavLink>
            <div className='avtar'>
                  {
                    logindata.ValidUserOne ? <Avatar style={{background:"salmon",fontWeight:"bold",textTransform:"capitalize"}} onClick={handleClick}>{logindata.ValidUserOne.fname[0].toUpperCase()}</Avatar> /*: ""*/
                    : <Avatar style={{background:"blue"}} onClick={handleClick} />


                  }
                </div>
                
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
      >
        {
          logindata.ValidUserOne ? (
            <div>
              <MenuItem onClick={()=>{
                 getDash()
                 handleClose()
               }}>Profile</MenuItem>
              <MenuItem onClick={()=>{ 
                logoutuser()
                handleClose()
              }}>Logout</MenuItem>
            </div>
          ) :

          (
          <div>
             <MenuItem onClick={()=>{
                  getError()
                  handleClose()
             }}>Profile</MenuItem>
          </div>
          )
        }
      </Menu>
            </nav>
        </header>
    </>
  )
}

export default Header
