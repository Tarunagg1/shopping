const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const  category = require('../model/category')


router.get('/',(req,res)=>{
    category.find({},(err,result)=>{
        if(err){
            throw err
        }else{
            res.render("admin/category",{data:result})
        }
    })
})

router.get('/add-category',(req,res)=>{
    res.render('admin/add-category')
})

router.post('/add-category',[
    body('category').not().isEmpty().escape()
    ],(req,res)=>{
     let error = validationResult(req);
    if(!error.isEmpty()){
        console.log("error accure");
    }else{
        console.log(req.body.category);
       let cat = new category({
            category:req.body.category
        })

        cat.save((err,result)=>{
            if(err)
                throw err;
            else{
                category.find({},(err,response)=>{
                    if(err)
                        throw err;
                    else{
                      req.app.locals.categories = response;
                    }
                  })
                // res.redirct('admin/category');
                res.render('admin/add-category',{message:"category inserted",type: "success", status: true})
            }
        })
    }
})

router.get('/delete-cat/:id',(req,res)=>{
    category.findByIdAndDelete(req.params.id,(err,result)=>{
        if(err)
            throw err
        else{
            category.find({},(err,response)=>{
                if(err)
                    throw err;
                else{
                  req.app.locals.categories = response;
                }
              })
            res.redirect('/admin/category')
        }
    })
})


module.exports = router;