const campground=require('../models/campground');
const reviews=require('../models/review');

module.exports.post =async(req,res)=>{
    const campgrounds =await campground.findById(req.params.id);
    const review =new  reviews(req.body.review);
    review.author=req.user._id;
    campgrounds.reviews.push(review);
    await review.save();
    await campgrounds.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}
module.exports.delete=async(req,res)=>{
    const {id,reviewId} =req.params;
    await campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await reviews.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}