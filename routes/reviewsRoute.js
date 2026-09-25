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
//validator function for reviews
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(404,error);    
    }else{
        next();
    }
};





//Reviews
//post route

router.post("/",validateReview,wrapAsync(async(req,res)=>{
   let listing =  await Listing.findById(req.params.id)
    
   //Add new Reviews process
   let newReview= new Review(req.body.review);

   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   
   console.log("new reviews added")
   res.redirect(`/listings/${listing._id}`);

}));




//DELETE REVIEW ROUTE

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id, reviewId}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}}) 
    let deleteData= await Review.findByIdAndDelete(reviewId);
    //  console.log(deleteData)
    res.redirect(`/listings/${id}`);

}))


module.exports=router;