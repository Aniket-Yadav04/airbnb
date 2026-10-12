
    const Listing=require("../models/listing");
    const Review=require("../models/review");

module.exports.createNewReview=async(req,res)=>{
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

};

module.exports.distroyReviews=async(req,res)=>{
    let{id, reviewId}=req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}}) 
    let deleteData= await Review.findByIdAndDelete(reviewId);
    //  console.log(deleteData)
       req.flash("success","Review Deleted Successfuly")
    res.redirect(`/listings/${id}`);

};