const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require("mongoose");
const app = express();
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
const $ = require('jquery');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-Patrick:9rpr-77-7P7pNK.@cluster0.b1frd.mongodb.net/runDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema of Mongoose models
const routeSchema = {
  routeName: String,
  wayPoints: Array,
  distance: Number,
  center: Array
}
const Route = mongoose.model("Route", routeSchema);


const userSchema = {
  username: String,
  password: String,
  favoriteRoutes: Array
}


const outingSchema = {
  routeName: String,
  date: Date,
  hours: Number,
  minutes: Number,
  seconds: Number,
}


// Create Mongoose models
const User = mongoose.model("User", userSchema);
const Outing = mongoose.model("Outing", outingSchema);



app.get("/", (req, res) => {
  res.render("home");
});





app.get("/routes", (req, res) => {
  var routesArray = [];

  Route.find({}, (err, foundRoutes) => {
    if (err) {
      console.log(err)
    } else if (!err) {

      foundRoutes.forEach(el => {
        routesArray.push(el);
      })

      res.render("routes", {
        routes: routesArray
      });
    }
  })
});




app.get("/routes/:routeId", (req, res) => {

  Route.findById(req.params.routeId, (err, selectedRoute) => {

    if (err) {
      console.log(err);
    } else if (!err) {

      console.log('Now rendering route page, with selectedRoute equal to....');
      console.log(selectedRoute);

      res.render("route", {
        route: selectedRoute
      })
    }
  })
});






app.get("/outings", (req, res) => {
  res.render("outings");
});





app.get("/new-outing", (req, res) => {
  var routesArray = [];
  Route.find({}, (err, foundRoutes) => {
    if (err) {
      console.log(err)
    } else if (!err) {
      foundRoutes.forEach(el => {
        routesArray.push(el.routeName);
      })
      console.log("the array sent to the 'new-outing' page is printed below")
      console.log(routesArray)
    }
    res.render("new-outing", {
      routes: routesArray
    });
  })
})


app.post("/new-outing", (req, res) => {
  console.log('the data posted from new-outing form is printed below:')
  console.log(req.body)

  var selectedRoute;
  Route.find({routeName: req.body.route}, (err, foundRoute) => {
    selectedRoute = foundRoute;
  }, function(err){
    if(!err){
      console.log(selectedRoute)
    }
  })

  Outing.create({
    routeName: req.body.route,
    date: req.body.date,
    hours: req.body.hours,
    minutes: req.body.minutes,
    seconds: req.body.seconds
  }, function(err) {
    if (err) {
      console.log(err)
    } else if (!err) {
      console.log('successfully added to database!')
    }
  });
  res.redirect("/outings")
});



app.get("/previous-outings", (req, res) => {
  Outing.find({}, (err, foundOutings) => {
    if (err) {
      console.log(err)
    } else if (!err) {

      var outingsArray = [];
      var distancesArray = [];
      foundOutings.forEach(el => {
        outingsArray.push(el);
        // Define the distance of the route for each outing
        // Route.findOne({ routeName: el.routeName }, (err, relatedRoute) => {
        //   distancesArray.push(relatedRoute[0].distance);
        //   console.log('distance of this outing is printed below:');
        //   console.log(relatedRoute[0].distance)
        // })

      })
      // console.log("distancesArray is printed below:");
      // console.log(distancesArray)
      // res.render("previous-outings", {outings: outingsArray, distance: distancesArray})
      console.log("outingsArray passed to /previous-outings page is printed below:");
      console.log(outingsArray)

      res.render("previous-outings", {outings: outingsArray})
    };
  });
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
  var wayPointsArr = JSON.parse("[" + wayPointsString + "]");

  //breaks the array of number values into many smaller arrays of two (long/lat pairs)
  var wayPointsArrArr = [];
  for (i = 0; i < wayPointsArr.length; i += 2) {
    var latLongPair = [wayPointsArr[i], wayPointsArr[i + 1]];
    wayPointsArrArr.push(latLongPair);
  };

  //convert the string value that is returned for the center of route into array
  var centerArr = JSON.parse("[" + req.body.center + "]");

  Route.create({
    routeName: req.body.routeName,
    wayPoints: wayPointsArrArr,
    distance: req.body.distance,
    center: centerArr
  }, function(err) {
    if (err) {
      console.log(err)
    } else if (!err) {
      console.log('successfully added to database!')
    }
  })

  res.redirect("/routes");
})



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, () => {console.log('server is running on port 3000')});
