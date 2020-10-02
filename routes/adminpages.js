const express = require('express')
const router = express.Router();
const page = require('../model/page')
const { body, validationResult } = require('express-validator');
const  category = require('../model/category')


router.get('/', (req, res) => {
    page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
        if (err)
            throw err
        else {
            res.render('admin/allpages', { title: "View-pages", data: pages })
        }
    })
})



router.get('/add-page', (req, res) => {
    res.render('admin/add_page', { title: "Add-page" })
})


router.post('/add-page', [
    body("title").not().isEmpty().trim().escape(),
    body("Slug").not().isEmpty().trim().escape(),
    body("content").not().isEmpty().trim().escape()
], (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        res.render('admin/add_page', {
            title: "add-page",
            errors: error
        })
    } else {
        let title = req.body.title;
        let slug = req.body.Slug.replace(/\s+/g, '-').toLowerCase();
        let content = req.body.content;
        page.findOne({ slug: slug }, (err, result) => {
            if (result) {
                res.render('admin/add_page', {
                    title: "add-page", type: "warning", status: false, message: "Slug is Avlilable"
                })
            }
            else {
                var pag = new page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                })
                pag.save((err, result) => {
                    if (err)
                        throw err
                    else {
                        page.find({},(err,response)=>{
                            if(err)
                                throw err;
                            else{
                              req.app.locals.pages = response;
                            }
                          })
                        res.redirect('/admin/pages');
                    }
                })
            }
        })
    }
})


router.get('/edit-pages/:slug', (req, res) => {
    page.findOne({ slug: req.params.slug }, (err, page) => {
        if (err)
            throw err
        else {
            page.find({},(err,response)=>{
                if(err)
                    throw err;
                else{
                 req.app.locals.pages = response;
                }
              })
            res.render('admin/edit_page', { title: "edit-page", data: page })
        }
    })
})


router.post('/edit-pages/:slug', [
    body("title").not().isEmpty().trim().escape(),
    body("Slug").not().isEmpty().trim().escape(),
    body("content").not().isEmpty().trim().escape()
], (req, res) => {
    let error = validationResult(req);
    let slug = req.params.slug;
    if (!error.isEmpty()) {
        res.redirect(slug);
    } else {
        uid = req.body.uid;
        page.findByIdAndUpdate({ _id: uid }, { title: req.body.title, slug: req.body.Slug, content: req.body.content }, (err, ru) => {
            if (err)
                throw err;
            else {
                page.find({},(err,response)=>{
                    if(err)
                        throw err;
                    else{
                      req.app.locals.pages = response;
                    }
                  })
                res.redirect('/admin/pages/');
            }
        })
    }
})


router.get('/delete-pages/:slug',(req,res)=>{    
    page.findOneAndDelete({slug:req.params.slug},(err,status)=>{
        if(err){
            throw err;
        }else{
            page.find({},(err,response)=>{
                if(err)
                    throw err;
                else{
                  req.app.locals.pages = response;
                }
              })
            res.redirect('/admin/pages/');
        }
    })
})


module.exports = router;
