var express=require("express");
var router=express.Router();
var orderController=require("../controller/orders");
var userController=require("../controller/users");
var fs=require("fs");
const tripcontroller = require("../controller/trips");



router.get("/booking",function(req,res){
    res.render("booking",{title:"Booking"});
})
/*
router.get("/order",function(req,res){
    console.log(req.session.user.availability);
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
            fs.readFile("book.json","utf-8",function(err,jsonData){
                if (err) throw err;
                try{
                    console.log("Data read");
                    const data=JSON.parse(jsonData);
                    data.orderStatus="Driver cancelled";
                    const newdata=JSON.stringify(data);
                    fs.writeFile("book.json",newdata,function(err){
                        if (err) throw err;
                        console.log("Data written");
                    })
                } catch (err){
                    console.log("Error while reading JSON file");
                }
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
*/
router.get("/tracking",function(req,res){
    res.render("tracking",{title:"Tracking"});
})

router.get("/history",function(req,res){
    if (req.session.user.type==="Customer"){
        tripcontroller.getTripbyCustomer(req.session.user.id).then(function(trip){
            if (trip){
                listTrip=[];
                let quantity=trip.length,total=0;
                for (let i=0;i<quantity;i++){
                    total+=trip[i].cost;
                    let context={
                        vehicle:trip[i].vehicle,
                        from:trip[i].start,
                        to:trip[i].dest,
                        cost:trip[i].cost,
                        pickTime:trip[i].pickTime,
                        dropTime:trip[i].dropTime,
                        tripStatus:trip[i].tripStatus
                    }
                    orderController.receiveBookedOrder(trip[i].BookingOrderId).then(function(booking){
                        context.bookTime=booking.bookingTime
                    })
                    listTrip.push(context);
                }
                //console.log(trip)
                //console.log(listTrip)
                res.render("history",{title:"History",Trips:listTrip,quantity,total});
            }
        })
        
    }
    else if (req.session.user.type==="Driver"){
        tripcontroller.getTripbyDriver(req.session.user.id).then(function(trip){
            if (trip){
                listTrip=[];
                let quantity=trip.length,total=0;
                for (let i=0;i<quantity;i++){
                    total+=trip[i].cost;
                    let context={
                        vehicle:trip[i].vehicle,
                        from:trip[i].start,
                        to:trip[i].dest,
                        cost:trip[i].cost,
                        pickTime:trip[i].pickTime,
                        dropTime:trip[i].dropTime,
                        tripStatus:trip[i].tripStatus
                    }
                    orderController.receiveBookedOrder(trip[i].BookingOrderId).then(function(booking){
                        context.bookTime=booking.bookingTime
                    })
                    listTrip.push(context);
                }
                //console.log(trip)
                //console.log(listTrip)
                res.render("history",{title:"History",Trips:listTrip,quantity,total});
            }
        })
        
    }
})

router.post("/loading",function(req,res){
    const driverId=req.body.driverId;
    const driver=req.body.driver;
    const start=req.body.from;
    const dest=req.body.to;
    const cost=req.body.cost;
    const time=req.body.time;
    const vehicle=req.body.vehicle;
    const pickup=new Date();
    const dropoff=new Date();
    const id=req.body.id;
    const trip={
        vehicle:vehicle,
        customerId:req.session.user.id,
        driverId:driverId,
        start:start,
        dest:dest,
        cost:cost,
        pickTime:pickup.setMinutes(pickup.getMinutes()+5),
        dropTime:dropoff.setMinutes(dropoff.getMinutes()+35),
        BookingOrderId:id,
        tripStatus:"Completed"
    }
    tripcontroller.createTrip(trip).then(function(){
        res.render("tracking",{title:"Tracking",driver,start,dest,cost,time,pickup,isConsumer:"true"})
    })
    
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
                bookingTime:new Date(),
                orderStatus:"Booked successfully",
                AccountId:user.id
            }/*
            let data=JSON.stringify(book);
            fs.writeFile("book.json",data,function(err){
                if (err) throw err;
                console.log("Data written");
            })*/
            orderController.createBookingOrder(book).then(function(booking){
                orderController.receiveBookedOrder(booking.id).then(function(order){
                    if (order){
                        var purchase={
                            form:payment,
                            cost:100000,
                            status:"Ready to pay",
                            BookingOrderId:order.id
                        }
                        book.id=order.id;
                        orderController.createPaymentOrder(purchase).then(function(){
                            orderController.getDriverAvailable().then(function(driver){
                                if (driver){
                                    let rand=Math.floor(Math.random()*driver.length);
                                    const driverInfo={
                                        id:driver[rand].id,
                                        name:driver[rand].name
                                    }
                                    orderController.updateResult(booking.id,driver[rand].id).then(function(booked){
                                        res.render("loading",{message:"Finding driver",book,purchase,driver:driverInfo,isFound:"true"});
                                    })
                                    
                                }
                                else
                                    res.render("loading",{message: "Finding driver",isFound:false});
                            })
                            
                        })
                    }
                })
            })
            
        
        }
    })  

    
    
    
    
})

module.exports=router;