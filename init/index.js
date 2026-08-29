const mongoose=require("mongoose");
const data=require("./data.js");
const Listing = require("../models/listing.js");


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

const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("data was initialise");

}

initDB();
