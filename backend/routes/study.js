const router=require("express").Router();
const Study=require("../models/StudyPlan");
const auth=require("../middleware/auth");

function generateTimetable(subjects, start){
 let plan=[];
 let current = start ? new Date(start) : new Date();

 subjects.forEach(sub=>{
   const dur = sub.duration || 60;
   sub.topics.forEach(topic=>{
     plan.push({
       subject:sub.name,
       topic,
       duration: dur,
       scheduledAt: current.toISOString()
     });
     current = new Date(current.getTime() + dur*60*1000);
   });
 });

 return plan;
}

router.post("/",auth,async(req,res)=>{
 const {subjects = [], startTime} = req.body;
 const userId=req.user.id;

 if (!subjects || subjects.length === 0) {
   // delete existing plan for user if any
   await Study.deleteOne({ userId });
   return res.json({ subjects: [], timetable: [] });
 }

 const timetable=generateTimetable(subjects,startTime);

 // upsert document so editing modifies existing plan
 const data=await Study.findOneAndUpdate(
   { userId },
   {
     userId,
     subjects,
     timetable,
     startTime: startTime ? new Date(startTime) : undefined
   },
   { new: true, upsert: true }
 );

 res.json(data);
});

router.get("/",auth,async(req,res)=>{
 const plan=await Study.findOne({userId:req.user.id});
 res.json(plan);
});

router.delete("/",auth,async(req,res)=>{
 const userId=req.user.id;
 await Study.deleteOne({ userId });
 res.json({ message: "Plan deleted successfully" });
});

module.exports=router;