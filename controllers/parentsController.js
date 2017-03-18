var bcrypt = require('bcryptjs');
var express = require('express');
var router  = express.Router();
var mysql = require('mysql')
var connection = require('../config/connection.js')

//this is the parents_controller.js file
router.get('/', function(req,res) {
  //console.log("Parents");
  query = "SELECT u.username, u.email FROM users AS u RIGHT JOIN parent_students AS ps ON u.id = ps.student_id WHERE ps.parent_id = ?";
    connection.query(query, [ req.session.user_id ], function(err, kids){
      console.log(kids);
      res.render('parents/parents', { 
        kids: kids,
        logged_in: req.session.logged_in,
        user_email: req.session.user_email,
        user_id: req.session.user_id,
        usertype: req.session.usertype,
        is_reader: req.session.is_reader,
        is_parent: req.session.is_parent
      });
    });

});


module.exports = router;
