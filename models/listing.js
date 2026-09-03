const { default: mongoose } = require("mongoose");
const mngoose=require("mongoose");

const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:
    {type:String,
     required:true,},
     
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage"
        },
        url:{
            type:String,
        default: "https://unsplash.com/photos/stone-path-through-banana-trees-xlAfCD2vOxQ",
        set:(v)=>v===""?"https://unsplash.com/photos/stone-path-through-banana-trees-xlAfCD2vOxQ "
        : v,
        }
     },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;
