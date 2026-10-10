let express =require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js")
//controllers mvc
const userController=require("../controllers/users.js");


router.get("/signup",userController.signupFormRender);
router.post("/signup",wrapAsync(userController.postNewUser));

router.get("/login",userController.loginPageRender);
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
 userController.authenticateUser );


router.get("/logout",userController.logoutUser);
module.exports=router