const express= require ("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../Utils/wrapAsync.js");
const ExpressError=require("../Utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl }=require("../middleware.js");
const userController=require("../controllers/user.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(userController.renderSignupForm));


router.get("/login",userController.renderLofinForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {failureFlash:true, failureRedirect:'/login'})
        ,userController.authLogin); 

router.get("/logout",userController.logout)

module.exports= router;