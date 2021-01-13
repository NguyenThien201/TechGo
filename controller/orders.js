var controller={};
var models=require("../models");
var Order=models.BookingOrder;
var Payment=models.Payment;
var User=models.Account;

controller.createBookingOrder=function(order){
    return Order.create(order);
}

controller.createPaymentOrder=function(order){
    return Payment.create(order);
}

controller.getPayment=function(id){
    return Payment.findOne({
        where:{BookingOrderId:id}
    })
}

controller.getOrderbyCustomer=function(id){
    return Order.findAll({
        where:{AccountId:id}
    })
}

controller.getOrderbyDriver=function(id){
    return Order.findAll({
        where:{driverFound:id}
    })
}
controller.receiveBookedOrder=function(id){
    return Order.findOne({
        where:{orderStatus:"Booked successfully",id:id}
    })
}

controller.getDriverAvailable=function(){
    return User.findAll({
        where:{type:"Driver",availability:"available"}
    })
}

controller.findCustomerbyID=function(id){
    return User.findOne({
        where:{type:"Customer",id:id}
    })
  }

controller.retrieveAcceptOrder=function(id){
    return Order.findOne({
        where:{
            orderStatus:"Driver accepted",
            id:id
        }
    })
}
controller.updateResult=function(id,driverId){
    return Order.update({driverFound:driverId},
        {
            where:{id:id}
        })
}

module.exports=controller;