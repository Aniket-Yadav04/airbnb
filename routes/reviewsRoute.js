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


const {validateReview, isLoggedin, isOwner, isrevieweauthor}=require("../middleware.js");





//Reviews
//post route

router.post("/",isLoggedin,validateReview,wrapAsync(async(req,res)=>{
   let listing =  await Listing.findById(req.params.id)
    
   //Add new Reviews process
   let newReview= new Review(req.body.review);
    newReview.author=req.user._id
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   
   console.log(newReview)
   req.flash("success","New Review added Successfuly")
   res.redirect(`/listings/${listing._id}`);

}));




//DELETE REVIEW ROUTE

router.delete("/:reviewId",isLoggedin,isrevieweauthor,wrapAsync(async(req,res)=>{
    let{id, reviewId}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}}) 
    let deleteData= await Review.findByIdAndDelete(reviewId);
    //  console.log(deleteData)
       req.flash("success","Review Deleted Successfuly")
    res.redirect(`/listings/${id}`);

}));


module.exports=router;