const express =require("express");
const router=express.Router();

//error handler
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Joi = require('joi');

//authenticator
const {isLoggedin, isOwner,validateListing}=require("../middleware.js");
//validators
const {listingSchema,reviewSchema}=require("../schema.js");

const Listing=require("../models/listing.js")

//require controllers
const listingControllers=require("../controllers/listings.js");
//Multer for file upload
const multer  = require('multer')

const {storage}=require("../cloudConfig.js");
const upload = multer({storage})
    //{new Get Route
router.get("/new",isLoggedin,listingControllers.renderNewForm);







//index route
router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedin,
    upload.single('listing[image]'),
    validateListing
 , wrapAsync(listingControllers.createNewListings));


router.route("/:id")
.get(wrapAsync(listingControllers.showListings))
.put(isOwner,isLoggedin,
    upload.single('listing[image]'),validateListing,wrapAsync(listingControllers.updateListings))
.delete(isOwner,isLoggedin,wrapAsync(listingControllers.deleteListings));

// "Creating New Route"
//}

//{edit route
router.get("/:id/edit",isLoggedin,isOwner,
    wrapAsync(listingControllers.editListings));

//update Route


//delete Route



//show route



module.exports=router;