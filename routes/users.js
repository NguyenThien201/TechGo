var express=require("express");
var uploadFile=require("express-fileupload");
//import {config} from "dotenv"
var router=express.Router();
var userController=require("../controller/users");
var nodemail=require("nodemailer");
var crypto=require("crypto");
var sendGridTransport=require("nodemailer-sendgrid-transport");
var sendGridMail=require("@sendgrid/mail");
//config();
require("dotenv").config();
//console.log(process.env);
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);


router.get("/login",function(req,res){
    req.session.returnURL=req.query.returnURL;
    res.render("login",{title:"Log in"});
});

router.use(uploadFile());

router.get("/signup",function(req,res){
    res.render("signup",{title:"Sign up"});
});


router.post("/login",function(req,res){
    let username=req.body.username;
    let password=req.body.password;
    let accountType=req.body.accountType;
    if (!accountType)
        accountType="Admin";
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
    var dob=req.body.dob;
    var password=req.body.password;
    var address=req.body.address;
    var phone=req.body.phone;
    var confirm=req.body.confirm;
    var accountType=req.body.accountType;
    //console.log(req.body.avatar)
    
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
            if (req.files){
                var avatar=req.files.avatar;
                var avatarName=avatar.name;
                avatar.mv("public/uploads/"+avatarName);
            }
            else
                var avatarName="avatar.png";
            user={
                name,dob,email,phone,avatar:avatarName,address,type:accountType,password,isAdmin:false
            }
            userController.createUser(user).then(function(user){
                res.render("login",{message:"You have registered successfully! Now please log in",kind:"alert-success",tilte:"Log in"}); 
                
            })
        })
    }).catch(error => next(error));
});
/*
router.get("/erase",function(req,res,next){
    userController.deleteUser("chitai@vnusa.com").then(function(){
        res.send("Done")
    })
})  */

router.get("/forgot",function(req,res){
    res.render("forgot",{title:"Forgot password"})
})

router.post("/forgot",function(req,res){
    const accountType=req.body.accountType;
    const email=req.body.email;
    userController.getUserTypebyEmail(email,accountType).then(function(user){
        if (!user)
            res.render("forgot",{message:"Email does not exist!",kind:"alert-danger"})
        crypto.randomBytes(32,function(err,buffer){
            if (err)
                res.send(err);
            const token=buffer.toString("hex");

            userController.updateKey(user.email,token,Date.now()+3600000).then(function(userMail){
                const mes={
                    from:"dokhiem2702@gmail.com",
                    to:user.email,
                    subject:"Reset password",
                    html:`
                        <h4>You have requested to reset your password</h4>
                        <p>Please click this <a href="http://localhost:8000/user/reset/${accountType}/${token}">link</a> to reset the password</p>`
                }
                sendGridMail.send(mes).then(function(){
                    res.render("confirm",{message:"Please check your email to get link for resetting password",title:"Ready to reset password",kind:"alert-success"});
                }).catch(function (error) {
                    res.send("Error occurs");
                  })
            }) 
        })     
    })
})

router.get("/reset/:type/:token",function(req,res){
   userController.getUserbyToken(req.params.token).then(function(user){
       //console.log(user.expireToken.getTime()," ",Date.now())
       if (!user) res.send("Link to reset password is unavailable");
       if (user.expireToken.getTime()<Date.now()) return res.send("Token has expired, please reset again");
       else res.render("reset",{title:"Reset password",type:req.params.type,token:req.params.token,ok:false});
   })
   
})


router.post("/reset/done",function(req,res){
    
    const newPass=req.body.newpass;
    const confirmnew=req.body.confirmnew;
    console.log(req.body.type,req.body.token);
    if (newPass!=confirmnew){
        res.render("reset",{title:"Reset password",message:"Confirm password must match with the origin one",kind:"alert-danger",ok:false});
        
    }
    userController.restorePassword(req.body.token,req.body.type,newPass).then(function(user){
        res.render("reset",{title:"Reset password",message:"Password is reset successfully",kind:"alert-success",ok:true})
    })
})

router.get("/profile",function(req,res){
    res.render("profile",{title:"Profile",user:req.session.user});
});

router.post("/profile",function(req,res){
    const name=req.body.name;
    const email=req.body.email;
    const dob=req.body.dob;
    const address=req.body.address;
    const phone=req.body.phone;
    const type=req.body.type;
    if (req.files){
        var fileavatar=req.files.imageAvatar;
        var newProfile={name:name,dob:dob,email:email,phone:phone,address:address,avatar:fileavatar.name,type:type}
    }
    else var newProfile={name:name,dob:dob,email:email,phone:phone,address:address,avatar:req.session.user.avatar,type:type}
    if (!name || !email || !dob || !address || !phone)
        res.render("profile",{message:"Do not leave black!",kind:"alert-danger",user:req.session.user})
    else{
        const currentEmail=req.session.user.email;
        userController.updateProfile(newProfile,currentEmail).then(function(){
            req.session.user.name=name;
            req.session.user.email=email;
            req.session.user.dob=dob;
            req.session.user.address=address;
            req.session.user.phone=phone;
            req.session.user.type=type;
            if (req.files){
                req.session.user.avatar=fileavatar.name;
                if (fileavatar.name){
                    //console.log(__dirname,__filename);
                    fileavatar.mv("public/uploads/"+fileavatar.name,function(error){
                        if (error) res.send("Error!");
                        else res.render("profile",{message:"Profile changed successfully!",kind:"alert-success",user:newProfile,avatar:fileavatar.name});
                    })
                }
            }        
            else{
                res.render("profile",{message:"Profile changed successfully!",kind:"alert-success",user:newProfile});
            }
            
            
        }
            
        )
    }
    
})

router.get("/password",function(req,res){
    res.render("changePassword",{title:"Change password"});
})

router.post("/password",function(req,res){
    const oldPass=req.body.oldpass;
    if (!userController.comparePassword(oldPass,req.session.user.password))
        res.render("changePassword",{title:"Change Password",message:"Incorrect Password",kind:"alert-danger"})
    else{
        const newPass=req.body.newpass;
        const confirmPass=req.body.confirmnew;
        if (newPass!=confirmPass)
            res.render("changePassword",{title:"Change Password",message:"New confirm password must match with the new original one",kind:"alert-danger"})
        else{
            const currentEmail=req.session.user.email;
            userController.updatePassword(newPass,currentEmail).then(function(){
                req.session.password=userController.getHashPassword(newPass);
                res.render("changePassword",{message:"Password changed successfully!",kind:"alert-success"});
            })
        }
    }
})
router.get('/signout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});




module.exports=router;