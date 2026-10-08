const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
let methodOverride = require('method-override')
const ejsMate=require("ejs-mate");
//Error handling middleware
const ExpressError=require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");

//express - session
const session = require("express-session");

//reviews model
// const review=require("./models/review.js");
const { wrap } = require("module");
// const Review = require("./models/review.js");

// Routes require from Folder
const listingRoute=require("./routes/listingRoutes.js");
const reviewsRoute=require("./routes/reviewsRoute.js");
const userRoute=require("./routes/userRoute.js");

// passport for authentication
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")
//connect-flash 
 const flash = require('connect-flash');
const { expression } = require("joi");

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


//  Express-  SESSION 
const sessionOption={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
};


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//calling sessions & flash()
app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   next();
});

app.get("/demouser",async (req,res)=>{
   let fakeuser=new User({
    email:"fakeuser@gmail.com",
    username:"delta-student"
   });
     let registerduser=await User.register(fakeuser,"hellowworld");
      res.send(registerduser);
    })

app.get("/",(req,res)=>{
    res.send("You are on Root");
});

//caling routes 
app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("",userRoute);



// ERROR middleWare for all routes 

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

//Error middleware clear
app.use((err,req,res,next)=>{
    let {statusCode=500,message="some thing went wrong"}=err
     res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
})


const port=8080;
app.listen(port,()=>{
    console.log(`Listining on port number ${port}`)
});

