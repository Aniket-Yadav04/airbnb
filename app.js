const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
let methodOverride = require('method-override')
const ejsMate=require("ejs-mate");
//Error handling middleware
const ExpressError=require("./utils/ExpressError.js");

// const Listing=require("./models/listing.js")

//reviews model
// const review=require("./models/review.js");
const { wrap } = require("module");
// const Review = require("./models/review.js");

// Routes require from Folder
const listingRoute=require("./routes/listingRoutes.js");
const reviewsRoute=require("./routes/reviewsRoute.js");


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


app.get("/cookies",(req,res)=>{
    res.cookie("Rahul","512");
    res.send("You are on Root");
});
//caling routes 
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewsRoute);

// ERROR middleWare for all routes 

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

//Error middleware 
app.use((err,req,res,next)=>{
    let {statusCode=500,message="some thing went wrong"}=err
     res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
})


const port=8080;
app.listen(port,()=>{
    console.log(`Listining on port number ${port}`)
});
