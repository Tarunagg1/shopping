const express = require('express')
const router =  express.Router();
const page = require('../model/page')
const product = require('../model/product')

router.get('/',(req,res)=>{
    product.find({},function(err,data){
        if(err)
            throw err;
        else{
            res.render('index',{title:"home",product:data})
        }
    })
});


router.get("/:slug",(req,res)=>{
    let slug = req.params.slug;
    page.findOne({slug:slug},(err,response)=>{
        if(err)
            throw err
        if(!response){
            res.redirect("/")
        }else{
            res.render('index',{title:response.title})
        }
    })
})


module.exports = router;
