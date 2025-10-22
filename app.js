if(process.env.NODE_ENV!=="production"){
  require('dotenv').config();
}


const express=require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./Utils/wrapAsync.js");
const ExpressError=require("./Utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review=require("./models/reviews.js");



const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));


app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const store =MongoStore.create({
  mongoUrl:process.env.ATLASDB_URL,
  crypto:{secret:process.env.SECRET },
  touchAfter:24*60*60, //in seconds
  

});

store.on("error",function(e){
  console.log("store error",e);
})

const sessionOptions={
  store,
 secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true,
    

  },
};



main().then((res)=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
   //
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



app.get("/",(req,res)=>{
    res.send("Working");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  // res.locals.currentUser = req.user;
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  
  next();
});


// app.get("/demouser",async(req,res)=>{
//   const  fakeUser=new User({
//     email:"student@gmail.com",
//     username:"student",
//   });
// let registeredUser= await User.register(fakeUser,"helloworld");
//  res.send(registeredUser);

// })



// app.get("/testListing",async (req,res)=>{
//    let  sampleListing = new Listing({
//     title: "Cozy Beachfront Cottage",
//     description:
//       "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//     price: 1500,
//     location: "Malibu",
//     country: "United States",

//    });
//    await sampleListing.save()
//    .then((result)=>{
//     console.log(result);
//     res.send("successfull");
//    })
//    .catch((err)=>{
//     console.log(err);
//    })

// });








app.use("/listings",listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter);

app.use("/",userRouter);



//revies

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// })
app.use((err,req,res,next)=>{
   let {statuscode=500,message="Something Went Wrong"}=err;
// res.status(statuscode).send(message);
  return res.render("error.ejs",{err});
})
app.listen(8080,()=>{
    console.log("app is listening");
})