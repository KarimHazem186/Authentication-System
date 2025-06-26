const mongoose = require('mongoose')

const DB = "mongodb+srv://mern-auth:mern1234@mern-auth.embzx.mongodb.net/Authusers?retryWrites=true&w=majority&appName=MERN-Auth"

mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser:true,
}).then(()=>console.log("DataBase Connected"))
.catch(err => console.log("Error Connecting ", err))
mongoose.set('strictQuery', true);