const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shopping', {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true},(err,link)=>{
    if(err){
        console.log('database not connected');
    }else{
        console.log('database connected');
    }
})