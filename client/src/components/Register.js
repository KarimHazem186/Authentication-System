import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './mix.css'
const Register = () => {
    const  [passShow,setPassShow] = useState(false)
    const  [cpassShow,setCPassShow] = useState(false)
    
    const [inpval,setInpval] = useState({
        fname:"",
        email:"",
        password:"",
        cpassword:""
    });

    console.log("Input Value ",inpval )

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

    const addUserdata = async (e) => {
        e.preventDefault()

        const {fname,email,password,cpassword} = inpval;

        if(fname==='') {
            alert("Please Enter Your Name")
        } else if (email==="") {
            alert("Please enter your email");
        } else if (!email.includes("@")) {
            alert("Enter valid email");
        } else if(password==='') {
            alert("Please Enter Your Password")
        } else if (password.length < 6) {
            alert("password must be 6 char");
        } else if(cpassword==='') {
            alert("Please Enter Your Confirm Password")
        } 
        // else if (cpassword.length < 6) {
        //     alert("password must be 6 char");
        // } 
        else if (password!==cpassword) {
            alert("password and confirm password not match")
        } else {
            // console.log("User Registeration Successfully Done")

            const data = await fetch("/register",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    fname,email,password,cpassword
                })
            });
            const res = await data.json();
            // console.log(res)
            
            if(res.status===201) {
                    alert("User Registeration Successfully done");
                    setInpval({...inpval,fname:"",email:"",password:"",cpassword:""})
                }
                
                console.log(res.status)
            }
    }

    return (
    <>
       <section>
            <div className='form_data'>
                <div className='form_heading'>
                    <h1>Sign Up</h1>
                    <p style={{textAlign:"center"}}>We are glad that you will be using Project Cloud to manage <br /> your tasks! We hope that you will get like it</p>
                </div>

                <form>
                    <div className='form_input'>
                        <label htmlFor='fname'>Name</label>
                        <input type='text' name='fname' value={inpval.fname} id='fname'  placeholder='Enter Your Name' onChange={setVal}/>
                    </div>
                    
                    <div className='form_input'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' value={inpval.email} id='email'  placeholder='Enter Your Email Address' onChange={setVal}/>
                    </div>
                    
                    <div className='form_input'>
                        <label htmlFor='password'>Password</label>
                        <div className='two'>
                        <input type={!passShow?"password":"text"} name='password' value={inpval.password} id='password'  placeholder='Enter Your Password ' onChange={setVal}/>
                        <div className='showpass' onClick={()=>setPassShow(!passShow)} >
                            {!passShow ? "Show":"Hide"}
                        </div>
                        </div>
                    </div>
                    
                    <div className='form_input'>
                        <label htmlFor='password'>Confirm Password</label>
                        <div className='two'>
                        <input type={!cpassShow?"password":"text"} name='cpassword' value={inpval.cpassword} id='cpassword'  placeholder='Confirm Password' onChange={setVal}/>
                        <div className='showpass' onClick={()=>setCPassShow(!cpassShow)} >
                            {!cpassShow ? "Show":"Hide"}
                        </div>
                        </div>
                    </div>

                    <button className='btn' onClick={addUserdata}>Sign Up</button>
                    <p>Already have an account? <NavLink to="/login">Log In</NavLink> </p>
                </form>
            </div>
        </section>  
    </>
  )
}

export default Register
