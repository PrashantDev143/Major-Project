const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../Utils/wrapAsync.js");
const Review=require("../models/reviews.js");
const ExpressError=require("../Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listings.js");
const{validateReview,isLoggedIn,isReviewAuthor}= require("../middleware.js");
const reviewController=require("../controllers/review.js");





router.post("/",isLoggedIn,validateReview,
    wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
)

module.exports=router;
