const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
let methodOverride = require('method-override')
const ejsMate=require("ejs-mate");

const Joi = require('joi');


//Error handling middleware
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

//joi schema
const {listingSchema}=require("./schema.js");

const Listing=require("./models/listing.js")


app.set("view engine","ejs");
app.engine('ejs',ejsMate);
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));






 const mongoUrl="mongodb://127.0.0.1:27017/wanderlust";


 main()
 .then(()=>{
    console.log("connected to db");
 })
 .catch((err)=>{
    console.log(err);
 })
 
 async function main(){
    try{
    await mongoose.connect(mongoUrl);
    // console.log('MongoDB Connected Successfully!');
    }catch(err){
        console.log("data base connection error: " ,err);
    }
}

app.get("/",(req,res)=>{
    res.send("You are on Root");
});

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
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//{new Get Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

// "Creating New Route"
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
 
   const newListing= new Listing(req.body.listing);

   await newListing.save();
   res.redirect("/listings");

}));//}



//{edit route
app.get("/listings/:id/edit",wrapAsync( async (req,res)=>{
       let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});


}));

//update Route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
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

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
     let {id}=req.params;
await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));





//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));




// ERROR middleWare for all routes 

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});



//Error middleware 
app.use((err,req,res,next)=>{
    let {statusCode=500,message="some thing wrong"}=err
     res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
})


const port=8080;
app.listen(port,()=>{
    console.log(`Listining on port number ${port}`)
});