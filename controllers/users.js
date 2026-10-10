const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js")
const User=require("../models/user");

module.exports.signupFormRender=(req,res)=>{
    res.render("users/signup.ejs");

};

module.exports.postNewUser=async (req,res)=>{
try{
 let {username,email,password}=req.body;
    const newUser = new User({email,username})
    const registerUser=await User.register(newUser,password);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err)
        }
    req.flash("success","welcome to wanderlust");
    res.redirect("/listings");
    })
  
}catch(e){
  req.flash("error",e.message);
  res.redirect("/signup");
} 
};

module.exports.loginPageRender=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.authenticateUser=async(req,res)=>{
    req.flash("success","welcome to wanderlust ! You are logedin")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return next(err);
        }
        else{
            req.flash("success","you are logged out")
            res.redirect("/listings")
        }
    })
};