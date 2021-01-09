const e = require("express");
var express=require("express");
var router=express.Router();
var userController=require("../controller/users");

router.get("/driver_account/:id",function(req,res){
    const id=req.params.id;
    userController.findUserbyID(id).then(function(user){
        var context={
            curLat:user.curLat,
            curLng:user.curLng,
            type:user.type
        }
        console.log(context.curLat,context.curLng)
        res.render("account",{title:"User location",context:context,isDriver:context.type==="Driver"})
    })
    
})

router.get("/account_management",function(req,res){
    userController.getAllDrivers().then(function(user){
        //console.log(user);
        listDriver=[];
        console.log(typeof user)
        
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