const mongoose = require("mongoose");

module.exports = mongoose.model("StudyPlan",{
 userId:String,
 subjects:Array,
 timetable:Array,
 startTime: Date
});