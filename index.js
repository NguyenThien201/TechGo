var express=require("express");
var app=express();


app.use(express.static(__dirname+"/public"));
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

let cookie_parser=require("cookie-parser");
app.use(cookie_parser());
var sessions=require("express-session");
app.use(sessions({
    cookie:{httpOnly:true,maxAge:30*24*60*60*1000},
    secret:"S3cret",
    resave:false,
    saveUninitialized:false
}));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

/*
app.get("/login",function(req,res){
    res.render("login",{title:"Log in"});
})

app.get("/signup",function(req,res){
    res.render("signup",{title:"Sign up"});
})*/
app.use(function(req,res,next){
    res.locals.username=req.session.user? req.session.user.name+" ("+req.session.user.type[0]+")" : "";
    res.locals.avatar=req.session.user? req.session.user.avatar:"";
    res.locals.isLoggedIn=req.session.user? true:false;
    res.locals.isAdmin=req.session.user? req.session.user.isAdmin: "";
    res.locals.isConsumer=req.session.user? req.session.user.type==="Customer":""; 
    next();
});

app.use("/",require("./routes/index"));
app.use("/user",require("./routes/users"));
app.use("/booktrack",require("./routes/booktrack"));
app.use("/admin",require("./routes/admin"));



/*

app.get("/booking",function(req,res){
    res.render("booking",{title:"Booking"});
})

app.get("/tracking",function(req,res){
    res.render("tracking",{title:"Tracking"});
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

var models=require("./models");
app.get("/sync",function(req,res){
    models.sequelize.sync().then(function(){
        res.send("Database sync complete");
    });
}); */  

app.listen(process.env.PORT|| app.get("port"),function(){
    console.log("Listening at port "+app.get("port")); 
})
