const express = require('express');
const router=express.Router();
const camp=require('../controllers/campgrounds')
const catchAsync =require('../utils/catchAsync');
const { isLoggedIn,isAuthor,validateCampground }=require('../middleware');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({storage});
const campground =require('../models/campground');


router.route('/')
    .get(catchAsync(camp.index))
    .post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(camp.newCamp));
   

router.get('/new',isLoggedIn, camp.newForm);
 
router.route('/:id')
    .get( catchAsync(camp.show))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(camp.editPut))
    .delete(isLoggedIn,isAuthor, catchAsync(camp.delete));


router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(camp.edit));
 

 
 module.exports=router;