const mongoose = require('mongoose')



let productschema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
    },
    desc:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String
    },
    data:{
        type:Date,
        default:Date.now()
    }
})

let product = mongoose.model('product',productschema)
module.exports = product;

