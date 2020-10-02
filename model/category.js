const mongoose = require('mongoose')

var category = mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    slug:{
        type:String,
    },
    data:{
        type:Date,
        default:Date.now()
    }
})

var category = mongoose.model('category',category);
module.exports = category;
