var controller={};
var models=require("../models");
var bcrypt=require("bcryptjs");
var User=models.Account;


controller.getAllDrivers=function(){
    return User.findAll({
        where:{type:"Driver"}
    })
}
controller.getAllCustomers=function(){
    return User.findAll({
        where:{type:"Customer"}
    })
}
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

controller.updateKey=function(email,token,expireToken){
    return User.update({resetToken:token,expireToken:expireToken},
        {
            where:{email:email}
        })
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

controller.updateProfile=function(newProfile,currentEmail){
    return User.update(newProfile,
        {
            where:{email:currentEmail}
        });
}
controller.updatePassword=function(password,currentEmail){
    return User.update({password:controller.getHashPassword(password)},
        {
            where:{email:currentEmail}
        });
}

controller.restorePassword=function(resetToken,type,password){
    return User.update({password:controller.getHashPassword(password),resetToken:null, expireToken:null},
        {
            where:{resetToken:resetToken,type:type}
        }
    )
}

controller.getUserbyToken=function(resetToken){
    return User.findOne({
        where:{ resetToken:resetToken}
    })
}

controller.getHashPassword=function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

controller.deleteUser=function(email){
    return User.destroy({
        where:{email:email}
    })
}

controller.findUserbyID=function(id){
    return User.findOne({
        where:{id:id}
    })
}
module.exports=controller;