var express=require("express");
var router=express.Router();





router.get("/",function(req,res){
    res.render("index",{title:"Home"});
})

router.get("/transport",function(req,res){
    res.render("transport",{title:"Transport"});
})

router.get("/delivery",function(req,res){
    res.render("delivery",{title:"Delivery"});
})

router.get("/aboutus",function(req,res){
    res.render("aboutus",{title:"About us"});
})

router.get("/whyTechGo",function(req,res){
    res.render("whyTechGo",{title:"Why choosing TechGo"});
})

module.exports=router;