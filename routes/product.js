const express = require('express')
const router = express.Router();
var mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeimg = require('resize-img')
const productmod = require('../model/product')
var mv = require('mv');
const { body, validationResult } = require('express-validator');
const category = require('../model/category')


router.get('/', (req, res) => {
    productmod.find({}, (err, result) => {
        if (err) {
            throw err
        } else {
            res.render("admin/allproduct", { data: result })
        }
    })
})

router.get('/add-product', (req, res) => {
    category.find({}, (err, category) => {
        if (err)
            throw err;
        else {
            res.render("admin/addproduct", { category: category })
        }
    })
})

router.post('/add-product', [
    body('pname').not().isEmpty(),
    body('pcat').not().isEmpty(),
    body('pprice').not().isEmpty().isNumeric(),
    body('pdesc').not().isEmpty(),
], (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        console.log("validat false");
    } else {
        let imagefile = req.files.pimg.name;
        let finalprice = parseFloat(req.body.pprice).toFixed(2)
        let pro = new productmod({
            title: req.body.pname,
            slug: req.body.pname,
            desc: req.body.pdesc,
            category: req.body.pcat,
            price: finalprice,
            image: imagefile
        })
        category.find({}, (err, category) => {
            if (err)
                throw err;
            else {
                pro.save((err, result) => {
                    if (err)
                        throw err;
                    else {
                        // mkdirp('public/product_img/'+result._id) 8470035

                        if (imagefile != " ") {
                            var productimage = req.files.pimg;
                            var path = 'public/product_img/' + imagefile;
                            productimage.mv(path, function (err) {
                                if (err)
                                    throw err;
                            })
                        }
                        res.render("admin/addproduct", { category: category, message: "product inserted", type: "success", status: true })
                    }
                })
            }
        })
    }

})

router.get('/delete-product/:id', (req, res) => {
    productmod.findByIdAndDelete(req.params.id, (err, data) => {
        if (err)
            throw err;
        else {
            productmod.find({}, (err, result) => {
                if (err) {
                    throw err
                } else {
                    res.redirect("/admin/product")
                }
            })
        }
    })
})

router.get('/edit-product/:id', (req, res) => {
    productmod.findById(req.params.id, (err, result) => {
        if (err)
            throw err;
        else {
            category.find({}, (err, category) => {
                if (err)
                    throw err;
                else {
                    res.render("admin/editproduct", { category: category, data: result })
                }
            })
        }
    })
})

router.post('/edit-product/:id',
    [
        body('pname').not().isEmpty(),
        body('pcat').not().isEmpty(),
        body('pprice').not().isEmpty().isNumeric(),
        body('pdesc').not().isEmpty(),
    ],
    (req, res) => {
        let id = req.params.id;
        let oldp = req.body.oldpic;
        let ischange = 0;
        let error = validationResult(req);
        if (!error.isEmpty()) {
            res.redirect(`/admin/product/edit-product/` + id)
        } else {
            let imagefile = "";
            if (req.files == null) {
                imagefile = oldp;
            } else {
                ischange = 1;
                imagefile = req.files.pimg.name
            }
            productmod.findOneAndUpdate({ _id: id }, { title: req.body.pname, slug: req.body.pname, desc: req.body.pdesc, category: req.body.pcat, price: req.body.pprice, image: imagefile }, (err, resut) => {
                if (err)
                    throw err;
                else {
                    if (ischange) {
                        if (oldp != " ") {
                            var path = 'public/product_img/' + oldp;
                            fs.remove(path, function (err) {
                                if (err)
                                    console.log(err);
                            })
                        }
                        if (imagefile != " ") {
                            var productimage = req.files.pimg;
                            var path = 'public/product_img/' + imagefile;
                            productimage.mv(path, function (err) {
                                if (err)
                                    throw err;
                            })
                        }
                    }
                    res.redirect("/admin/product")
                }
            })
        }
    })



module.exports = router;
