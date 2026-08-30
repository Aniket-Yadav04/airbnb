const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");

const Listing=require("./models/listing.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


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
})


app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

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