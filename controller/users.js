var controller={};
var models=require("../models");
var bcrypt=require("bcryptjs");
var User=models.Account;

controller.createUser=function(user){
    var salt=bcrypt.genSaltSync(10);
    user.password=bcrypt.hashSync(user.password,salt);
    return User.create(user);
}
controller.getUserTypebyEmail=function(email,accountType){
    return User.findOne({
        where:{email:email,type:accountType}
    });
}

controller.getUserTypebyPhone=function(phone,accountType){
    return User.findOne({
        where:{phone:phone,type:accountType}
    });
}

controller.comparePassword=function(password,hash){
    return bcrypt.compareSync(password,hash);
}
controller.isLoggedIn=function(req,res,next){
    if (req.session.user)
        next();
    else
        res.redirect(`/user/login?returnURL=${req.originalUrl}`);
}

controller.getAllDrivers=function(){
    return User.findAll({
        where:{type:"Driver"}
    })
}

module.exports=controller;