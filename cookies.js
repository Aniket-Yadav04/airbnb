  
  //This is called cookies code
   
  
  // req count using express session
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//       req.session.count=1;
//     }
   
//      res.send(`You sent a request ${req.session.count} times`);
// })




// app.get("/test",(req,res)=>{
//     res.send("test sucssefull");
// })








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








// app.get("/register",(req,res)=>{
//     let {name="anonymus"}=req.query;
//     req.session.name=name;
//     if(name=== "anonymus"){
//         req.flash("error","user Not register  successfully");

//     }else{
//          req.flash("success","user register succesfully");

//     }
   
//     res.redirect("/hello");
// });

// app.get("/hello",(req,res)=>{
//     res.locals.message=req.flash("success")
//     res.locals.error=req.flash("error");
//     res.render("views.ejs",{name:req.session.name});
//     // res.send(`hellow, ${req.session.name}`);

// });
