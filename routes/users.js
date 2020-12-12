var express=require("express");
var router=express.Router();
var userController=require("../controller/users");


router.get("/login",function(req,res){
    req.session.returnURL=req.query.returnURL;
    res.render("login",{title:"Log in"});
});

router.get("/signup",function(req,res){
    res.render("signup",{title:"Sign up"});
});



router.post("/login",function(req,res){
    let username=req.body.username;
    let password=req.body.password;
    let accountType=req.body.accountType;
    //let keepLoggedIn=req.body.keepLoggedIn!=undefined;
    userController.getUserTypebyEmail(username,accountType)
    .then(function(user){
        if (user){
            if (userController.comparePassword(password,user.password)){
                    //req.session.cookie.maxAge=keepLoggedIn? 30*24*60*60*1000:null;
                    req.session.user=user;
                    if (req.session.returnURL)
                        res.redirect(req.session.returnURL);
                    else
                        res.redirect("/");
                }
                else
                    res.render("login",{message:"Incorrect Email/Phone number or Password",kind:"alert-danger"});
        } else{
            userController.getUserTypebyPhone(username,accountType)
            .then(function(user){
                if (user){
                    if (userController.comparePassword(password,user.password)){
                        //req.session.cookie.maxAge=keepLoggedIn? 30*24*60*60*1000:null;
                        req.session.user=user;
                        if (req.session.returnURL)
                            res.redirect(req.session.returnURL);
                        else
                            res.redirect("/");
                    }
                    else
                        res.render("login",{message:"Incorrect Email/Phone number or Password",kind:"alert-danger"});
                } 
                else
                    res.render("login",{message:"Incorrect Email/Phone number or Password",kind:"alert-danger"});
            })
        }
    })
})


router.post("/signup",function(req,res,next){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    var address=req.body.address;
    var phone=req.body.phone;
    var confirm=req.body.confirm;
    var accountType=req.body.accountType;
    //var keepLoggedIn=req.body.keepLoggedIn!=undefined;
    if (password!=confirm)
        return res.render("signup",{message:"Confirm password does not match with the original password!",kind:"alert-danger"}); 
    
    userController.getUserTypebyEmail(email,accountType)
    .then(function(user){
        if (user)
            return res.render("signup",{message:"Email already exists! Please take another one",kind:"alert-danger"}); 
        userController.getUserTypebyPhone(phone,accountType).then(function(user){
            if (user)
                return res.render("signup",{message:"Phone number already exists! Please take another one",kind:"alert-danger"}); 
            user={
                name,email,phone,address,type:accountType,password,isAdmin:false
            }
            userController.createUser(user).then(function(user){
                res.render("login",{message:"You have registered successfully! Now please log in",kind:"alert-success",tilte:"Log in"}); 
                
            })
        })
    }).catch(error => next(error));
});
/*
router.get("/signout",function(req,res,next){
    req.session.destroy(function(err){
        if (err) return next(err);
        return res.render("login",{title:"Log in"});
    })
}) */
router.get('/signout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

module.exports=router;