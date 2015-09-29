// server.js
//BASE SETUP


//calling the packages we need
var express = require('express');

var app = express(); //defining our app
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node-api-helloworld');
var Bear = require('./app/models/bear')

//configure app to user bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080 //use env variable for port if available, else 8080

//ROUTES FOR OUR API
var router = express.Router();

//implement middleware for all requests (do logging)
router.use(function(req, res, next) {
  console.log('Something is happening');
  next();
})

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

//routes for /BearSchema
router.route('/bears')

  //create a bear
  .post(function(req, res) {
    var bear = new Bear() //create instance of bear object
    bear.name = req.body.name; //grab the request body property of name and set it as the bears name
    //save it and check for errors
    bear.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: 'Bear created'});
      }
    });
  }) //note that the .get is a continued line and there is NO SEMICOLON HERE!
  .get(function(req, res) {
  //get all bears
    Bear.find(function(err, bears) {
      if (err) {
        res.send(err);
      } else {
        res.json(bears);
      }
    });
  });

router.route('/bears/:bear_id')
  .get(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.json(bear);
      }
    });
  })
  .put(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err) {
        res.send(err);
      } else {
        //update the bears name
        bear.name = req.body.name;
        //attempt to save it
        bear.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'Bear updated!'});
          }
        });
      }
    });
  })
  .delete(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err) {
        res.send(err);
      } else {
        bear.remove(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.json({message: 'Bear successfully destroyed'});
          }
        });
      }
    });
  });
//REGISTERING THE ROUTES

app.use('/api', router); //prefix our routes with /api

//START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
