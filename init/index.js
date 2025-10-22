const mongoose = require("mongoose");
const initData = require("./data.js");
const  Listing=require("../models/listings.js");

main().then((res)=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,
      owner:"68d18017db5bf23216c09853"}))
    await Listing.insertMany(initData.data);
    console.log("Data Was Initialized");
}

initDB();