const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
  //password and username are automatically defined

});

userSchema.plugin(passportLocalMongoose); //adds username and password
module.exports=mongoose.model("User",userSchema);