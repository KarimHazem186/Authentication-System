import React, { useEffect, useState } from 'react'
import {ToastContainer,toast} from 'react-toastify'
import {useNavigate, useParams} from 'react-router-dom'
const ForgotPassword = () => {
//  const params =useParams();
// console.log("{UserId,Token}",params)
 
const {id,token} =useParams();

const history = useNavigate();

const [password, setPassword] = useState("")

const [message, setMessage] = useState("")

const userValid = async()=>{
  const res = await fetch (`/forgotpassword/${id}/${token}`,{
    credentials:"include",
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await res.json()
  if(data.status===201) {
    console.log("User Valid")
  }
  else {
    history("*")
  }
}

const setval=(e)=>{
  setPassword(e.target.value)
}

const sendPassword = async(e)=>{
  e.preventDefault();
  const res = await fetch(`/${id}/${token}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({password})
  });

  const data = await res.json()

  if(data.status===201) {
    setPassword("")
    setMessage(true)
  } else {
    toast.error("! Token Expired generate new Link")
  }
}

useEffect(()=>{
  userValid()
},[])

  return (
    <>
      <section>
            <div className='form_data'>
                <div className='form_heading'>
                    <h1>Enter Your NEW Password</h1>
                </div>
                <form>
                  {message ? <p style={{color:"green",fontWeight:"bold",justifyContent:"center",display:"flex"}}>Password Successfully Updated</p> :""}
                    <div className='form_input'>
                        <label htmlFor='password'>NEW Password</label>
                        <input type='password' name='password' value={password} id='password'  placeholder='Enter Your New Password' onChange={setval}/>
                    </div>
                    
                    
                    <button className='btn' onClick={sendPassword}>Send</button>
                </form>
                <ToastContainer />
            </div>
        </section>
    </>
  )
}

export default ForgotPassword