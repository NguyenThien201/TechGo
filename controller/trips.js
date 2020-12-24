var controller={};
var models=require("../models");
var Trip=models.Trip;

controller.createTrip=function(trip){    
    return Trip.create(trip);
}

controller.geTripBy=function(email,accountType){
    return Trip.findOne({
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