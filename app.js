const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
let methodOverride = require('method-override')
const ejsMate=require("ejs-mate");



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

//index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//{new Get Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//post route adding new listing
app.post("/listings",async(req,res)=>{
   const newListing= new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});//}



//{edit route
app.get("/listings/:id/edit", async (req,res)=>{
       let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});


});

//update Route
app.put("/listings/:id",async (req,res)=>{
      let {id}=req.params;
      const newUpdatedData=req.body.listing;
    // await Listing.findByIdAndUpdate(id,{...req.body.listing})
       await Listing.findByIdAndUpdate(id,newUpdatedData);
      res.redirect("/listings");

});

//delete Route

app.delete("/listings/:id",async(req,res)=>{
     let {id}=req.params;
await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});





//show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});



















// app.get("/testListing", async (req,res)=>{
//      let sampleListing=new Listing({
//         title:"My New villa",
//         description:"by the beach",
//         price:1200,
//         location:"calangut , Goa",
//         country:"India",
//      });
//       await sampleListing.save();
//       console.log("sample was saved");
//       res.send("succesful testing");
// });

const port=8080;
app.listen(port,()=>{
    console.log(`Listining on port number ${port}`)
});