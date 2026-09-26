const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
let methodOverride = require('method-override')
const ejsMate=require("ejs-mate");
//Error handling middleware
const ExpressError=require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");

//express session
const session = require("express-session");

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


// app.get("/root",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.send("your cookies are being collected");
// })

// app.use(cookieParser("secretcode"));

// app.get("/cookies",(req,res)=>{
//   let data= req.cookies
//   console.dir(data);
//     res.send("You are on Root");
// });

// app.get("/greet",(req,res)=>{
//     let {name}=req.cookies;
//     res.send(`${name}  Namaste welcome on board`);
    
// })

// app.get("/getssignedcookie",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("signed cookies send");

// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");

// }
// )






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
