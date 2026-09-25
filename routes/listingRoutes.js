const express =require("express");
const router=express.Router();

//error handler
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Joi = require('joi');

//validators
const {listingSchema,reviewSchema}=require("../schema.js");

const Listing=require("../models/listing.js")



//validate listings function
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
}else{
    next();
}
};




//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//{new Get Route
router.get("/new", (req,res)=>{
    res.render("listings/new.ejs");
});

// "Creating New Route"
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
 
   const newListing= new Listing(req.body.listing);

   await newListing.save();
   res.redirect("/listings");

}));//}



//{edit route
router.get("/:id/edit",wrapAsync( async (req,res)=>{
       let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});


}));

//update Route
router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
      if(!req.body.listing){
       throw new ExpressError(400,"Data not found")
    }
      let {id}=req.params;
      console.log(id);
      const newUpdatedData=req.body.listing;
    // await Listing.findByIdAndUpdate(id,{...req.body.listing})
       await Listing.findByIdAndUpdate(id,newUpdatedData);
    //    console.log(newUpdatedData);
      res.redirect("/listings");

}));

//delete Route

router.delete("/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

module.exports=router;