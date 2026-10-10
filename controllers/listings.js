const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
          res.render("listings/new.ejs");
};

module.exports.showListings=async (req,res)=>{
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
};

module.exports.deleteListings=async(req,res)=>{
     let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success","Listing deleted successfuly");
  res.redirect("/listings");
};

module.exports.updateListings=async (req,res)=>{
      if(!req.body.listing){
       throw new ExpressError(400,"Data not found")
    }
         const {id} =req.params;
   
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
      
    //    console.log(newUpdatedData);
       req.flash("success","Listing Updated Successfuly")
      res.redirect("/listings");

};

module.exports.editListings=async (req,res)=>{
       let {id}=req.params;
    const listing= await Listing.findById(id);
     if(!listing){
        req.flash("error"," Listing you requested for Does not exist");
        res.redirect("/listings");
    }else{
    res.render("listings/edit.ejs",{listing});
    }
};

module.exports.createNewListings=async(req,res,next)=>{
 
   const newListing= new Listing(req.body.listing);
   newListing.owner=req.user._id;
   await newListing.save();
   req.flash("success","New Listing saved Successfuly")
   res.redirect("/listings");

}



