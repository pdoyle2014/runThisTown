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


const routeSchema = {
  routeNumber: Number,
  routeName: String,
  wayPoints: Array,
  distance: Number,
  center: Array
}


// Create Mongoose model "Route"
const Route = mongoose.model("Route", routeSchema);




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

      res.render("route", {route: selectedRoute})
    }
  })
});






app.get("/outings", (req, res) => {
  res.render("outings");
});


app.get("/analysis", (req, res) => {
  res.render("analysis");
});



app.get("/new-route", (req, res) => {
  res.render("new-route");
});


// app.get("/routes/:routeNumber", (req,res) => {
//
//   req.params.
//
// });





app.listen(3000, console.log('server is running on port 3000'));
