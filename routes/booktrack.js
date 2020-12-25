var express=require("express");
const { isLoggedIn } = require("../controller/trips");
var router=express.Router();
var tripController=require("../controller/trips");
var userController=require("../controller/users")

var userName = require("../index")
router.get("/booking",function(req,res){
    res.render("booking",{title:"Booking"});
})
router.get("/tracking",function(req,res){
    res.render("tracking",{title:"Tracking"});
})

router.get("/history",function(req,res){
    res.render("history",{title:"History"});
})

router.post("/booking",function(req,res){
    var startLocation=req.body.start;
    var endLocation=req.body.end;
    var vehicleType=req.body.vehicleType;
    var payment=req.body.paymentMethod;
    console.log("User has book") ;
    console.log(req.body);
    // tripController.createTrip(trip);
    //var keepLoggedIn=req.body.keepLoggedIn!=undefined;
    var i = 0;
    var refreshIntervalId;

    var startList = startLocation.replace("(","").replace(")","").replace(" ","").toString().split(",");    
    var endList = endLocation.replace("(","").replace(")","").replace(" ","").toString().split(",");    
    console.log(startList[0]);

    //get user id by console.log(req.session.user.name);
    
    let userId="user";
    let driverId="";
    let startLat = startList[0];
    let startLng = startList[1];
    let endLat = endList[0];
    let endLng = endList[1];
    let tripStatus = 1;
    
    
    // put the find driver here
    var call = function() { 
        if (i >= 10) {             
            clearInterval(refreshIntervalId);
            trip = {
                // sequelize model:create --name Trip --attributes userId:string,driverId:string,vehicle:string,startLat:decimal,startLng:decimal,stopLat:decimal,stopLng:decimal,tripStatus:integer

                userId,driverId,vehicle:vehicleType,startLat,startLng,stopLat:endLat,stopLng:endLng,tripStatus
            }
            
            tripController.createTrip(trip);
    
            return;
        }

        i+=20;
      
    }
    refreshIntervalId = setInterval(call, 2000);

/* later */

    return res.render("booking",{message: "Finding driver"});

})

module.exports=router;

