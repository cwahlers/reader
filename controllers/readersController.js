var bcrypt = require('bcryptjs');
var express = require('express');
var dateutil = require('dateutil');
var router  = express.Router();
var mysql = require('mysql')
var connection = require('../config/connection.js')

//this is the readers_controller.js file
router.get('/', function(req,res) {
  var query = "SELECT l.created, l.time_lapsed, b.title , DATE_FORMAT(l.created, '%d/%m/%Y') AS 'log_created' FROM logs l LEFT JOIN books b ON l.book_id = b.id WHERE user_id = ?";
  connection.query(query, [ req.session.user_id ], function(err, logs){
    //console.log(logs);
    var sum = 0;
    if (logs){
      for (var i = 0; i < logs.length; i++) {
        sum += logs[i].time_lapsed
      }
    }
    res.render('readers/readers', { 
      logs: logs,
      logged_in: req.session.logged_in,
      user_email: req.session.user_email,
      user_id: req.session.user_id,
      usertype: req.session.usertype,
      sum : sum
    });
  });

  // var query = "SELECT * FROM books WHERE user_id = ?";
  // connection.query(query, [ req.session.user_id ], function(err, books){

  // });

  // res.render('readers/readers', req.session);
});


//logging time
router.post('/log', function(req,res) {
  //check if the user has already posted time
  // user_id int NOT NULL,
  // book_id int NOT NULL,
  // created date NOT NULL,
  // time_lapsed dec(6,2),
  var currentDate = dateutil.format( dateutil.today(), 'Y-m-d');
  var totalTime = req.body.totalTime;
  var query = "SELECT * FROM log WHERE user_id = ? AND book_id = ? AND created = ? ";
  connection.query(query, [ req.session.user_id, req.body.book, currentDate ], function(err, logs){
    console.log(logs);
    if(err){
      //Assumes no time logged
      query = "INSERT INTO logs (user_id, book_id, created, time_lapsed ) VALUES (?, ?, ?, ?)"
      connection.query(query, [ req.session.user_id, req.body.book, currentDate, req.body.totalTime ], function(err, response) {
      if (err) res.send('500');
      else res.render('readers/readers', req.session);
      });
    }else if ( logs.time_lapsed >= 0 ) {
      totalTime =+ logs.time_lapsed;
      query = "UPDATE logs SET time_lapsed = ? WHERE user_id = ? AND book_id = ? AND created = ?"
      
      connection.query(query, [ totalTime, req.session.user_id, req.body.book, currentDate ], function(err, response) {
        if (err) res.send('500');
        else res.render('readers/readers', req.session);
      });
  };

  });


});



module.exports = router;
