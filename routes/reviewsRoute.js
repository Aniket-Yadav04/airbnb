const express =require("express");
const router=express.Router({mergeParams:true});

//error handler
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Joi = require('joi');

//validators
const {listingSchema,reviewSchema}=require("../schema.js");

const Listing=require("../models/listing.js")

//model for reviews
const Review = require("../models/review.js");
const {validateReview, isLoggedin, isOwner, isrevieweauthor, saveRedirectUrl}=require("../middleware.js");
//controllers MVC
const reviewControllers=require("../controllers/reviews.js");

//Reviews
//post route
router.post("/",isLoggedin,validateReview,
wrapAsync(reviewControllers.createNewReview));


//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedin,isrevieweauthor,
wrapAsync(reviewControllers.distroyReviews));


module.exports=router;