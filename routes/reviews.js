const express = require('express');
const router = express.Router({mergeParams:true});
// const ExpressError =require('../utils/ExpressErrors');
// const campground =require('../models/campground');
const review=require('../controllers/review')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware')
// const reviews=require('../models/review');

const catchAsync =require('../utils/catchAsync');

router.post('/', validateReview,isLoggedIn, catchAsync(review.post)); 

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(review.delete));

module.exports= router;