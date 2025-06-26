const jwt = require("jsonwebtoken")
const userdb = require("../models/userSchema")
const keysecret = process.env.SECRET_KEY

const authenticate = async(req,res,next)=>{
    try {
        const token = req.headers.authorization;
        // console.log(token);
        const verifytoken = jwt.verify(token,keysecret);

        const rootUser = await userdb.findOne({_id: verifytoken._id});

        // console.log(rootUser)

        if(!rootUser) {throw new Error("user not found")}

        req.token = token;
        // console.log(req.token)
        
        req.rootUser = rootUser;
        // console.log(req.rootUser)
        
        req.userId = rootUser._id;
        // console.log(req.userId)

        next();
    } catch (e) {
        res.status(401).json({status: 401, message:"Unauthorized no token provide"})
    }

}

module.exports = authenticate