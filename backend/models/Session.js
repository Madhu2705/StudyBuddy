const mongoose = require("mongoose");

module.exports = mongoose.model("Session",{
 userId:String,
 subject:String,
 minutes:Number,
 date:{type:Date,default:Date.now}
});