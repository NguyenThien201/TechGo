const e = require("express");
var express=require("express");
var router=express.Router();
var userController=require("../controller/users");
var orderController=require("../controller/orders");
var tripController=require("../controller/trips");

router.get("/driver_account/:id/location",function(req,res){
    const id=req.params.id;
    userController.findUserbyID(id).then(function(user){
        var context={
            curLat:user.curLat,
            curLng:user.curLng,
            type:user.type
        }
        //console.log(context.curLat,context.curLng)
        res.render("account",{title:"User location",type:"driver",id,context:context,isConsumer:false})
    })
    
})

router.get("/customer_account/:id/location",function(req,res){
    const id=req.params.id;
    userController.findUserbyID(id).then(function(user){
        var context={
            curLat:user.curLat,
            curLng:user.curLng,
            type:user.type
        }
        //console.log(context.curLat,context.curLng)
        res.render("account",{title:"User location",type:"customer",id,context:context,isConsumer:true})
    })
    
})


router.get("/driver_account/:id/rides",function(req,res){
    const id=req.params.id;
    tripController.getTripbyDriver(id).then(function(ride){
        
        listRide=[]
        for (let i=0;i<ride.length;i++){
            let context={
                vehicle:ride[i].vehicle,
                pickTime:ride[i].pickTime,
                dropTime:ride[i].dropTime,
                start:ride[i].start,
                dest:ride[i].dest,
                cost:ride[i].cost,
                status:ride[i].tripStatus
            }
            userController.findUserbyID(ride[i].customerId).then(function(user){
                if (user){
                    context.customer=user.name;
                    console.log(user.name);
                }
                listRide.push(context);
                console.log(context);
            })
            
            
        }
        res.render("historymanage",{title:"Book management",listRide,isConsumer:false,type:"driver",id:id})
    })
})

router.get("/customer_account/:id/rides",function(req,res){
    const id=req.params.id;
    tripController.getTripbyCustomer(id).then(function(ride){
        console.log(ride)
        listRide=[]
        for (let i=0;i<ride.length;i++){
            let context={
                vehicle:ride[i].vehicle,
                pickTime:ride[i].pickTime,
                dropTime:ride[i].dropTime,
                start:ride[i].start,
                dest:ride[i].dest,
                cost:ride[i].cost,
                status:ride[i].tripStatus
            }
            
            userController.findUserbyID(ride[i].driverId).then(function(user){
                if (user){
                    context.driver=user.name;
                    console.log(user.name);
                }
                listRide.push(context);
                
            })
            
            
        }
        res.render("historymanage",{title:"Book management",listRide,isConsumer:true,type:"customer",id:id})
    })
})

router.get("/driver_account/:id/activities",function(req,res){
    const id=req.params.id;
    orderController.getOrderbyDriver(id).then(function(order){
        
        listOrder=[]
        for (let i=0;i<order.length;i++){
            let context={
                vehicle:order[i].vehicle,
                bookingTime:order[i].bookingTime,
                
                start:order[i].start,
                end:order[i].end,
                cost:order[i].cost,
                status:order[i].orderStatus
            }
            userController.findUserbyID(order[i].AccountId).then(function(user){
                if (user){
                    context.customer=user.name;
                    console.log(user.name);
                }
                listOrder.push(context);
                console.log(context);
            })
            
            
        }
        res.render("bookmanage",{title:"Book management",listOrder,isConsumer:false,type:"driver",id:id})
    })
})

router.get("/customer_account/:id/activities",function(req,res){
    const id=req.params.id;
    orderController.getOrderbyCustomer(id).then(function(order){
        
        listOrder=[]
        for (let i=0;i<order.length;i++){
            let context={
                vehicle:order[i].vehicle,
                bookingTime:order[i].bookingTime,
                start:order[i].start,
                end:order[i].end,
                cost:order[i].cost,
                status:order[i].orderStatus
            }
            userController.findUserbyID(order[i].driverFound).then(function(user){
                if (user){
                    context.driver=user.name;
                    console.log(user.name);
                }
                listOrder.push(context);
                console.log(context);
            })
            
            
        }
        res.render("bookmanage",{title:"Book management",listOrder,isConsumer:false,type:"customer",id:id})
    })
})



router.get("/account_management",function(req,res){
    userController.getAllDrivers().then(function(user){
        //console.log(user);
        listDriver=[];
        
        user.forEach(element => {
            temp={};
            temp.id=element.id;
            temp.name=element.name;
            temp.dob=element.dob;
            temp.email=element.email;
            temp.phone=element.phone;
            temp.address=element.address;
            listDriver.push(temp);
        }); 
        
        userController.getAllCustomers().then(function(user){
            listCustomer=[];
            user.forEach(element => {
                temp={};
                temp.id=element.id;
                temp.name=element.name;
                temp.dob=element.dob;
                temp.email=element.email;
                temp.phone=element.phone;
                temp.address=element.address;
                listCustomer.push(temp);                                
            });
            //console.log(context);
            //res.json(context)
            res.render("manage",{title:"Account Management",listDriver:listDriver,listCustomer:listCustomer});
        })
    })
    
})
module.exports=router;