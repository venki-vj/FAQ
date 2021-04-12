const {CampgroundSchema,reviewSchema}=require('./schemas.js');
const ExpressError =require('./utils/ExpressErrors');
const campground =require('./models/campground');
const reviews=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error',"You must be logged in first");
       return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground=(req,res,next)=>{
    const {error}=CampgroundSchema.validate(req.body)
    if(error){
        const msg =error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params;
    const campgrounds=await campground.findById(id);
    if(!campgrounds.author.equals(req.user.id)){
        req.flash('error','You do not have permission to do it');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await reviews.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do it');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
