var controller={};
var models=require("../models");
var Trip=models.Trip;
var User=models.Account;

controller.createTrip=function(trip){    
    return Trip.create(trip);
}

controller.getTripbyCustomer=function(id){
    return Trip.findAll({
        where:{customerId:id}
    })
}

controller.getTripbyDriver=function(id){
    return Trip.findAll({
        where:{driverId:id}
    })
}




module.exports=controller;