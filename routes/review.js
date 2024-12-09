const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError =require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controller/reviews.js");
const Review = require("../models/review.js");



//post Reviews Route
  router.post("/", 
    isLoggedIn,
    validateReview,  
    wrapAsync(reviewController.createReview )); 
  
  // Delete  Review Route
   
  router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));


  module.exports = router;