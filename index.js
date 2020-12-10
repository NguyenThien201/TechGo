var express=require("express");
var app=express();

app.use(express.static("public"));
var expressHbs=require("express-handlebars");
var hbs=expressHbs.create({
    extname:"hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname+"/views/layouts",
    partialsDir:__dirname+"/views/partials"
})
app.engine("hbs",hbs.engine);
app.set("view engine","hbs");

app.set("port",(process.env.PORT|8000));

app.get("/",function(req,res){
    res.render("index",{title:"Home"});
})

app.get("/booking",function(req,res){
    res.render("booking",{title:"Booking"});
})

app.get("/tracking",function(req,res){
    res.render("tracking",{title:"Tracking"});
})

app.get("/login",function(req,res){
    res.render("login",{title:"Log in"});
})

app.get("/signup",function(req,res){
    res.render("signup",{title:"Sign up"});
})

app.get("/history",function(req,res){
    res.render("history",{title:"History"});
})

app.get("/transport",function(req,res){
    res.render("transport",{title:"Transport"});
})

app.get("/delivery",function(req,res){
    res.render("delivery",{title:"Delivery"});
})

app.get("/aboutus",function(req,res){
    res.render("aboutus",{title:"About us"});
})

app.get("/whyTechGo",function(req,res){
    res.render("whyTechGo",{title:"Why choosing TechGo"});
})

app.listen(app.get("port"),function(){
    console.log("Listening at port "+app.get("port")); 
})
