const mongoose = require('mongoose')

var pageschema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    sorting:{
        type:Number,
    },
    data:{
        type:Date,
        default:Date.now()
    }
})

var page = mongoose.model('page',pageschema);
module.exports = page;
