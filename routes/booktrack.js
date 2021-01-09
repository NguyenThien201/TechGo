var express=require("express");
var router=express.Router();
var tripController=require("../controller/trips");
var orderController=require("../controller/orders");
var userController=require("../controller/users");
var fs=require("fs");



router.get("/booking",function(req,res){
    res.render("booking",{title:"Booking"});
})

router.get("/order",function(req,res){
    orderController.receiveBookedOrder().then(function(order){
        if (!order)
            res.render("order",{title:"Order",message:"You haven't still had an order yet.",kind:"alert-danger"});
        else if (req.session.user.availability==="available"){
            var context={
                id:order.id,
                time:order.bookingTime,
                start:order.start,
                end:order.end,
                vehicle:order.vehicle
            }
            userController.findUserbyID(order.AccountId).then(function(user){
                if (user){
                    context.name=user.name;
                    orderController.getPayment(order.id).then(function(payment){
                        if (payment){
                            context.form=payment.form;
                            context.cost=payment.cost;
                            res.render("order",{title:"Order",context})
                        }
                    })
                }
                })
                
            }
        })
        
    
})

router.post("/order",function(req,res){
    var context={
        name:req.body.name,
        start:req.body.start,
        end:req.body.end,
        cost:req.body.cost
    }
    var book=req.body.book;
    
    var confirm=req.body.confirm;
    if (confirm==="decline"){
        orderController.updateBookingStatus(book,"Driver cancelled").then(function(){
            fs.readFileSync("book.json",function(err,data){
                if (err) throw err;
                console.log("Data read");
                var book=JSON.parse(data);
                console.log(book);
                book.orderStatus="Driver cancelled";
                
            });
            data=JSON.parse(book);
                fs.writeFileSync("book.json",data,function(err){
                    if (err) throw err;
                    console.log("Data written");
                })
            res.render("order",{message:"Order has been cancelled",kind:"alert-danger"})
        })
    }
    else if (confirm==="accept"){
        fs.readFile("book.json",function(err,data){
            if (err) throw err;
            console.log("Data read");
            let book=JSON.parse(data);
            book.orderStatus="Driver accepted";
            data=JSON.parse(book);
            fs.writeFile("book.json",data,function(err){
                if (err) throw err;
                console.log("Data written");
            })
        })
        orderController.updateBookingStatus(book,"Driver accepted",req.session.user.name).then(function(){
            res.render("/tracking",{title:"Tracking",context,isConsumer:req.session.type==="Customer"});
        })
    }
    
})

router.get("/tracking",function(req,res){
    res.render("tracking",{title:"Tracking"});
})

router.get("/history",function(req,res){
    res.render("history",{title:"History"});
})

router.post("/booking",function(req,res){
    
    var start=req.body.start;
    var end=req.body.end;
    var vehicleType=req.body.vehicleType;
    var payment=req.body.paymentMethod;
    //console.log("User has book") ;
    //console.log(req.body);
    // tripController.createTrip(trip);
    //var keepLoggedIn=req.body.keepLoggedIn!=undefined;
    

    //var startList = startLocation.replace("(","").replace(")","").replace(" ","").toString().split(",");    
    //var endList = endLocation.replace("(","").replace(")","").replace(" ","").toString().split(","); 
    userController.getUserTypebyEmail(req.session.user.email,req.session.user.type).then(function(user){
        if (user){
            var book={
                vehicle:vehicleType,
                start:start,
                end:end,
                bookingTime:Date.now(),
                orderStatus:"Waiting for driver",
                AccountId:user.id
            }
            let data=JSON.stringify(book);
            fs.writeFileSync("book.json",data,function(err){
                if (err) throw err;
                console.log("Data written");
            })
            orderController.createBookingOrder(book).then(function(){
                orderController.receiveBookedOrder().then(function(order){
                    if (order){
                        var purchase={
                            form:payment,
                            cost:100000,
                            status:"Ready to pay",
                            BookingOrderId:order.id
                        }
                        orderController.createPaymentOrder(purchase).then(function(){
                            
                            res.render("loading",{message: "Finding driver"});
                        })
                    }
                })
            })
            
        
        }
    })   
    //

    

    
    

    //get user id by console.log(req.session.user.name);
    
    
    
    // put the find driver here
    /*
    var i = 0;
    var refreshIntervalId;
    var c=1;
                    var call = function() { 
                        if (i >= 10) {             
                            clearInterval(refreshIntervalId);
                            c++;
                            if (c==10)
                                
                            return;
                        }
                        console.log(i);
                        i+=20;
                      
                    }
                    refreshIntervalId = setInterval(call, 2000);
                    */
/* later */
    
    
    
})

module.exports=router;