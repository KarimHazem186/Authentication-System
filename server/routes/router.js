const express = require('express');
const router = new express.Router();
const userdb = require('../models/userSchema');
const bcrypt = require('bcryptjs')
const authenticate = require('../middleware/authenticate')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const keysecret = process.env.SECRET_KEY



// email config 
const transporter = nodemailer.createTransport({
    tls: {
        rejectUnauthorized: false,
        // key: fs.readFileSync('path/to/key.pem'),
        // cert: fs.readFileSync('path/to/cert.pem'),
    },
    port: 587,
    secure: false,
    service:"gmail",
    auth:{
        user:process.env.APP_EMAIL_ADDRESS,
        pass:process.env.APP_EMAIL_PASSWORD
        // pass:"iuizhjomfdobglbz"
    }
})



// for user registration
router.post('/register',async (req,res)=>{
    // console.log(req.body);
    const {fname,email,password,cpassword} = req.body;

    if(!fname || !email || !password || !cpassword) {
        res.status(422).json({error:"Fill all the details"})
    }
    try {
        const preuser = await userdb.findOne({email:email});

        if(preuser) {
            res.status(422).json({error:"This is Email is Already Exists"})
        } else if(password!==cpassword) {
            res.status(422).json({error:"Password and Confirm Password Not Match"})
        } else {
            const finalUser = new userdb ({
                fname,email,password,cpassword
            });

            // here password hashing

            const storeData = await finalUser.save()

            // console.log(storeData);

            res.status(201).json({status:201,storeData})

        }
    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error")

    }
});


// user Login

router.post('/login', async (req, res)=>{
    // console.log(req.body)

    const {email,password} = req.body;

    if(!email || !password) {
        res.status(422).json({error:"Fill all the details"})
    }

    try {
        const userValid = await userdb.findOne({email:email});

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password)

            if(!isMatch) {
                res.status(422).json({error:"Password Not match"})
                // res.status(422).json({error:"Invalid details"})
            } else {
                // token generate
                const token = await userValid.generateAuthtoken(); // creating an authentication token using userValid.generateAuthtoken(). This token is likely used for user authentication and authorization.

                // console.log(token);

                // cookiegenerate
                res.cookie("usercookie ",token,{ //  a cookie named “usercookie” with the generated token
                    expires: new Date(Date.now()+9000000), // he cookie will expire after a certain time (in this case, 9000000 milliseconds from the current time).
                    httpOnly: true //  Setting this to true ensures that the cookie is accessible only via HTTP requests and not through JavaScript on the client side (enhancing security).
                });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result});
            }

        }
    } catch (error) {
        res.status(401).json(error);
        console.log("catch block")
    }
    
})


// user valid 
router.get('/validuser',authenticate,async(req,res) => {
    // console.log("done")
    console.log("UserId ",req.userId)
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        console.log("ValidUserOne", ValidUserOne)
        res.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        res.status(401).json({status:401,error});
    }
})

    // user logout 
    router.get('/logout', authenticate, async (req, res) => {
        try {
            req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
                return curelem.token != req.token
            });
            res.clearCookie("usercookie", { path: "/" });
            await req.rootUser.save();

            res.status(201).json({ status: 201, tokens: req.rootUser.tokens });

        } catch (error) {
            res.status(401).json({ status: 401, error: "An error occurred during logout",error});
        }
    });

    // send email link for reset Password 
    router.post("/sendpasswordlink",async(req,res)=>{
        console.log(req.body)

        const {email} = req.body;
        if(!email) {
            res.status(401).json({status:401,message:"Enter Your Email"})
        }

        try {
            const userfind = await userdb.findOne({email:email});
            // console.log("userfind ",userfind)
            
            // token generate for reset password
            const token = jwt.sign({_id:userfind._id},keysecret,{
                expiresIn:"1d"
            });
            // console.log("token",token)
            const setusertoken = await userdb.findByIdAndUpdate({_id:userfind._id},{verifytoken:token},{new:true})
            // console.log("setusertoken ",setusertoken)

            if(setusertoken) {
                const mailOptions = {
                    from:process.env.APP_EMAIL_ADDRESS,
                    to:email,
                    subject:"Send Email For Password Reset",
                    text:`This Link Valid For 1 day http://localhost:3000/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
                }
                const info = await transporter.sendMail(mailOptions)
                try {
                    console.log("Email Sent: " + info.response);
                    res.status(201).json({ status: 201,message:"Email Sent Successfully" ,info });

                } catch (err) {
                    console.log("Error ",err)
                    res.status(401).json({ status: 401,message:"Email not Send"});                    
                }
                
            }
        } catch(err) {
            res.status(401).json({ status: 401,message:"Invalid User"});
        }
    })


    // verify user for forgot password time
    
    router.get("/forgotpassword/:id/:token",async(req,res)=>{
    const {id,token} = req.params;
    // console.log(id,token)
    try {
        const validuser = await userdb.findOne({_id:id,verifytoken:token});
        // console.log(validuser)
        const verifyToken = jwt.verify(token,keysecret);

        console.log(verifyToken)

        if(validuser && verifyToken._id){
            res.status(201).json({status:201,validuser})
        }else{
            res.status(401).json({status:401,message:"user not exist"})
        }

        } catch (error) {
            res.status(401).json({status:401,error})
        }
    });

// change password 
router.post("/:id/:token",async(req,res)=>{
    const {id,token} = req.params;
    const {password} = req.body;

    try {
        const validuser = await userdb.findOne({_id:id,verifytoken:token});
        const verifyToken = jwt.verify(token,keysecret);

        if(validuser&&verifyToken._id) {
            const newpassword = await bcrypt.hash(password,12)

            const setnewuserpass = await userdb.findByIdAndUpdate({_id:id},{password:newpassword})

            await setnewuserpass.save()
            
            res.status(201).json({status:201,setnewuserpass})

        }
        else {
            res.status(401).json({status:401,message:"user not exist"})
        }
    } catch(error) {
        res.status(401).json({status:401,error})
    }
})


module.exports = router;

// 2 way connection 
// 12345 ----> e#@$hagsjd
// e#@$hagsjd ----> 12345

// hashing compare 
// 1 way connection 
// 1234 ->> e#@$hagsjd
// 1234 ->> (e#@$hagsjd,e#@$hagsjd) => true