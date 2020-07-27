const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require("mongoose");
const app = express();
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const $ = require('jquery');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/runDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Define schema of Mongoose models
const routeSchema = {
  routeName: String,
  wayPoints: Array,
  distance: Number,
  center: Array
}

const userSchema = {
  username: String,
  password: String,
  favoriteRoutes: Array
}

//runtime is saved in seconds
const outingSchema = {
  route_id: String,
  date: Date,
  hours: Number,
  Minutes: Number,
  Seconds: Number,
  username: String
}


// Create Mongoose models
const Route = mongoose.model("Route", routeSchema);
const User = mongoose.model("User", userSchema);
const Outing = mongoose.model("Outing", outingSchema);



app.get("/", (req, res) => {
  res.render("home");
});





app.get("/routes", (req, res) => {
var routesArray = [];

  Route.find({}, (err, foundRoutes) => {
    if (err){console.log(err)}
    else if (!err){

      foundRoutes.forEach( el => {
        routesArray.push(el);
      })

      res.render("routes", {routes: routesArray});
    }
  })
});




app.get("/routes/:routeId", (req, res) => {

  Route.findById(req.params.routeId, (err, selectedRoute) => {

    if (err){ console.log(err); }
    else if (!err) {

      console.log('Now rendering route page, with selectedRoute equal to....');
      console.log(selectedRoute);

      res.render("route", {route: selectedRoute})
    }
  })
});






app.get("/outings", (req, res) => {
  res.render("outings");
});


app.get("/new-outing", (req,res) => {
  var routesArray = [];
  Route.find({}, (err, foundRoutes) => {
    if (err){console.log(err)}
    else if (!err) {
      foundRoutes.forEach( el => {
        routesArray.push(el.routeName);
      })
      console.log("the array sent to the 'new-outing' page is printed below")
      console.log(routesArray)
    }
    res.render("new-outing", {routes: routesArray});
  })
})


app.post("/new-outing", (req, res) => {

  console.log('the data posted from new-outing form is printed below:')
  console.log(req.body)


  function getRuntimeSeconds(hr, min, sec){

  }

  res.redirect("/routes")
});






app.get("/analysis", (req, res) => {
  res.render("analysis");
});



app.get("/new-route", (req, res) => {
  res.render("new-route");
});



app.post("/new-route", (req, res) => {
  var newRoute = req.body;
  console.log('Now printing newRoute:')
  console.log(newRoute);

 //converts the long string of numerals separated by commas to an array of number values
  var wayPointsString = req.body.wayPoints;
  var wayPointsArr = JSON.parse("[" + wayPointsString + "]" );

  //breaks the array of number values into many smaller arrays of two (long/lat pairs)
  var wayPointsArrArr = [];
  for (i=0; i<wayPointsArr.length; i+=2){
    var latLongPair = [wayPointsArr[i], wayPointsArr[i+1]];
    wayPointsArrArr.push(latLongPair);
  };


  //convert the string value that is returned for the center of route into array
  var centerArr = JSON.parse("[" + req.body.center + "]");


  Route.create({
    routeName: req.body.routeName,
    wayPoints: wayPointsArrArr,
    distance: req.body.distance,
    center: centerArr
  }, function(err){
    if(err){ console.log(err) }
    else if(!err) {console.log('successfully added to database!')}
  })

  res.redirect("/routes");

  // const routeSchema = {
  //   routeName: String,
  //   wayPoints: Array,
  //   distance: Number,
  //   center: Array
  // }

})



app.get("/previous-outings", (req,res) => {
  res.render("/previous-outings")
});



app.listen(3000, console.log('server is running on port 3000'));
