const User=require("../models/user.js");

module.exports.renderSignupForm=async(req,res)=>{
      try{
 const {username,email,password}=req.body;
        const user=new User({email,username});
        const registeredUser=await User.register(user,password);
       console.log(registeredUser);
       req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to WanderLust");
        res.redirect("/listings");
       })
       
      }
      catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
      }
       
    
};


module.exports.renderLofinForm=(req,res)=>{
    res.render("users/login.ejs");

};


module.exports.authLogin=async(req,res)=>{
    req.flash("success","welcome back!");
    let redirectUrl = res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);

};


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Goodbye!");
        return res.redirect("/listings");
    });
    
};