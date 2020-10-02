const express = require('express')
var path = require('path')
const mongoose = require('mongoose')
var db = require('./database')
var pages = require('./routes/pages')
var adminpages = require('./routes/adminpages')
const category = require('./routes/category')
const bodyParser = require('body-parser')
const session = require('express-session')
var fileupload = require('express-fileupload')
var product = require('./routes/product')
const pagex = require('./model/page');
const  categorymodal = require('./model/category')




var app = express();



// view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'public')))

app.use(bodyParser.urlencoded({extended:true}));    
app.use(bodyParser.json());

////// express file upload middleware
app.use(fileupload());


//////////////////// set gobal veriable
app.locals.errors = null
app.locals.message = null
app.locals.categor = null;
app.locals.pages = null


////////////////////// get all pages
pagex.find({},(err,response)=>{
  if(err)
      throw err;
  else{
    app.locals.pages = response;
  }
})

//////////////// get al category
categorymodal.find({},(err,response)=>{
  if(err)
      throw err;
  else{
    app.locals.categories = response;
  }
})

////////////////////////// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

  ///////////////////////////////////////// express message

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



//////////////////////// set routes
app.use('/',pages);
app.use('/admin/pages',adminpages);
app.use('/admin/category',category)
app.use('/admin/product',product)


port = 3000;

app.listen(port,()=>{
    console.log('app is listening'+port);
})