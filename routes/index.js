var express=require("express");
var router=express.Router();


router.get("/contact",function(req,res){
    res.render("contact",{title:"Contact us"})
})

router.get("/test",function(req,res){
    res.render("test");
})
router.post("/test",function (req,res) {
    res.send(req.body.ok+" "+req.body.name)
    console.log(req.body.ok+" "+req.body.name)
})


router.get("/",function(req,res){
    if (req.session.user){
        if (req.session.user.type==="Driver"){
            return res.render("index",{title:"Home",isDriver:true,isConsumer:false});
        }
        else if (req.session.user.type==="Customer"){
            return res.render("index",{title:"Home",isDriver:false,isConsumer:true});
        }
    }
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

router.get("/report_incident",function(req,res){
    res.render("incident",{title:"Incident report"})
})
module.exports=router;