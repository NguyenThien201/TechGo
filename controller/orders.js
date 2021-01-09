var controller={};
var models=require("../models");
var Order=models.BookingOrder;
var Payment=models.Payment;

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

controller.receiveBookedOrder=function(){
    return Order.findOne({
        where:{orderStatus:"Waiting for driver"}
    })
}

controller.retrieveAcceptOrder=function(id){
    return Order.findOne({
        where:{
            orderStatus:"Driver Accept",
            id:id
        }
    })
}
controller.updateBookingStatus=function(id,status,nameDriver){
    return Order.update({orderStatus:status,driver:nameDriver},
        {
            where:{id:id}
        })
}
module.exports=controller;