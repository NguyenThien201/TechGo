var express=require("express");
const { route } = require("./users");
var router=express.Router();


router.get("/contact",function(req,res){
    res.render("contact",{title:"Contact us"})
})


router.get("/",function(req,res){
    res.render("index",{title:"Home"});
})

router.get("/transport",function(req,res){
    res.render("transport",{title:"Transport"});
})

router.get("/help",function(req,res){
    res.render("help",{title:"Help Centre"});
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