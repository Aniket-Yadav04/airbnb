const express =require("express");
const router=express.Router();

//error handler
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Joi = require('joi');

//authenticator
const {isLoggedin, isOwner,validateListing}=require("../middleware.js");
//validators
const {listingSchema,reviewSchema}=require("../schema.js");

const Listing=require("../models/listing.js")


//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//{new Get Route
router.get("/new",isLoggedin, (req,res)=>{
    
  
          res.render("listings/new.ejs");
    
   
});

// "Creating New Route"
router.post("/",validateListing,isLoggedin,wrapAsync(async(req,res,next)=>{
 
   const newListing= new Listing(req.body.listing);
   newListing.owner=req.user._id;
   await newListing.save();
   req.flash("success","New Listing saved Successfuly")
   res.redirect("/listings");

}));//}



//{edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync( async (req,res)=>{
       let {id}=req.params;
    const listing= await Listing.findById(id);
     if(!listing){
        req.flash("error"," Listing you requested for Does not exist");
        res.redirect("/listings");
    }else{
    res.render("listings/edit.ejs",{listing});
    }
    


}));

//update Route
router.put("/:id",isOwner,isLoggedin,validateListing
    ,wrapAsync(async (req,res)=>{
      if(!req.body.listing){
       throw new ExpressError(400,"Data not found")
    }
         const {id} =req.params;
   
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
      
    //    console.log(newUpdatedData);
       req.flash("success","Listing Updated Successfuly")
      res.redirect("/listings");
      

}));

//delete Route

router.delete("/:id",isOwner,isLoggedin,wrapAsync(async(req,res)=>{
     let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success","Listing deleted successfuly");
  res.redirect("/listings");
}));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= 
    await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner")
    
    if(!listing){
        req.flash("error"," Listing you requested for Does not exist");
        res.redirect("/listings");
       
    }else{
    res.render("listings/show.ejs",{listing});
    }
}));

module.exports=router;