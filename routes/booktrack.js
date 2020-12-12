var express=require("express");
var router=express.Router();

router.get("/booking",function(req,res){
    res.render("booking",{title:"Booking"});
})

router.get("/tracking",function(req,res){
    res.render("tracking",{title:"Tracking"});
})

router.get("/history",function(req,res){
    res.render("history",{title:"History"});
})

router.post("/booking",function(req,res){
    var startLocation=req.body.start;
    var endLocation=req.body.end;
    var vehicleType=req.body.vehicleType;
    var payment=req.body.payment
    
})

module.exports=router;

