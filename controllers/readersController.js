var bcrypt = require('bcryptjs');
var express = require('express');
var dateutil = require('dateutil');
var router  = express.Router();
var mysql = require('mysql')
var connection = require('../config/connection.js')

//this is the readers_controller.js file
router.get('/', function(req,res) {
  res.render('readers/readers', req.session);
});


//logging time
router.post('/log', function(req,res) {
  //check if the user has already posted time
  // user_id int NOT NULL,
  // book_id int NOT NULL,
  // created date NOT NULL,
  // time_lapsed dec(6,2),
  var query = "INSERT INTO logs (user_id, book_id, created, time_lapsed ) VALUES (?, ?, ?, ?)"
  var currentDate = dateutil.now();

    connection.query(query, [ req.session.user_id, req.body.book_id, currentDate, req.body.time ], function(err, response) {
      if (err) res.send('500');
      else res.render('readers/readers', req.session);
    });
});



module.exports = router;
