const Review=require("../models/reviews.js");
const Listing = require("../models/listings.js");

module.exports.createReview=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    const newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${id}`);

};


module.exports.deleteReview=async(req,res,next)=>{
        const{id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Review.findByIdAndDelete(reviewId);
         req.flash("success", " review deleted");
        res.redirect(`/listings/${id}`);
    };