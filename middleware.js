  const Listing=require("./models/listing.js");
 const ExpressError=require("./utils/ExpressError.js");
 const Review=require("./models/review.js");
 const {listingSchema,reviewSchema}=require("./schema.js");
 module.exports.isLoggedin=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
       req.flash("error","you must be loged in to create listings!");
      return  res.redirect("/login");
    }

        next();
    
}

 module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    
    res.locals.redirectUrl=req.session.redirectUrl;
    
  }
  next();
 };

 module.exports.isOwner=async(req,res,next)=>{
    const currUser=req.user;
         let {id}=req.params;
        let listing= await Listing.findById(id);
        if(!listing){
          req.flash("error","id not found");
          res.redirect("/listings");
        }
         if( ! currUser || ! listing.owner.equals(currUser._id)){
            req.flash("error","You dont have permission to Do this");
           return res.redirect(`/listings/${id}`)
         }
         next();
 }

 module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
}else{
    next();
}
};

//validator function for reviews
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
         throw new ExpressError(404,error);    
    }else{
        next();
    }
};

module.exports.isrevieweauthor=async(req,res,next)=>{
      let {reviewId , id}=req.params;
      let review=await Review.findById(reviewId);
      if(!review.author.equals(req.user._id)){
        req.flash("error","you can't delete someone post")
       return res.redirect(`/listings/${id}`)
      }
      next()
}