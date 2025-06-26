import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './mix.css'
const Login = () => {
    const  [passShow,setPassShow] = useState(false)
    
    const [inpval,setInpval] = useState({
        email:"",
        password:"",
    });

    const history = useNavigate()

    // console.log("Input Value ",inpval )

    const setVal = (e) =>{
        // console.log(e.target.value)
        const {name,value} =e.target;
        setInpval(()=>{
            return {
                ...inpval,
                [name]:value
            }
        })
    }

    const loginUser = async (e) => {
        e.preventDefault()

        const {email,password} = inpval;

        if (email==="") {
            alert("Please enter your email");
        } else if (!email.includes("@")) {
            alert("Enter valid email");
        } else if(password==='') {
            alert("Please Enter Your Password")
        } else if (password.length < 6) {
            alert("password must be 6 char");
        } else {
            // console.log('User Login Successfully done')

            const data = await fetch("/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    email,password
                })
            });
            const res = await data.json();
            // console.log(res)
            
            if(res.status===201) {
                    localStorage.setItem("usersdatatoken",res.result.token)
                    alert("User Login Successfully done");
                    history('/dashboard')
                    setInpval({...inpval,email:"",password:""})
                }
                
                // console.log(res.status)
            }
    }
    

    
    return (
    <>
        <section>
            <div className='form_data'>
                <div className='form_heading'>
                    <h1>Welcom Back, Log In</h1>
                    <p>Hi, we are you glad you are back, Please login.</p>
                </div>

                <form>
                    <div className='form_input'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' value={inpval.email} id='email'  placeholder='Enter Your Email Address' onChange={setVal}/>
                    </div>
                    
                    <div className='form_input'>
                        <label htmlFor='password'>Password</label>
                        <div className='two'>
                        <input type={!passShow?"password":"text"} name='password' value={inpval.password} id='password'  placeholder='Enter Your Password' onChange={setVal}/>
                        <div className='showpass' onClick={()=>setPassShow(!passShow)} >
                            {!passShow ? "Show":"Hide"}
                        </div>
                        </div>
                    </div>
                    <button className='btn' onClick={loginUser}>Login</button>
                    <p>Don't have an Account? <NavLink to='/register'>Sign Up</NavLink> </p>
                    <p style={{color:"black",fontWeight:"bold"}}>Forget Password <NavLink to='/password-reset'>Click Here</NavLink> </p>
                </form>
            </div>
        </section>
    </>
  )
}

export default Login
