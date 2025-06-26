const mongoose = require('mongoose')


mongoose.connect(DB,{
    useUnifiedTopology: true,
    useNewUrlParser:true,
}).then(()=>console.log("DataBase Connected"))
.catch(err => console.log("Error Connecting ", err))
mongoose.set('strictQuery', true);
