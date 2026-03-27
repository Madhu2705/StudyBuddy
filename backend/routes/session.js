const router=require("express").Router();
const Session=require("../models/Session");
const auth=require("../middleware/auth");

router.post("/",auth,async(req,res)=>{
 const userId=req.user.id;
 const payload={...req.body,userId};
 const session=await Session.create(payload);
 res.json(session);
});

router.get("/",auth,async(req,res)=>{
 const data=await Session.find({userId:req.user.id});
 res.json(data);
});

module.exports=router;