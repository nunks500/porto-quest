var express = require('express');
var router = express.Router();
var database = require('../models/lowdatabase');
const { Client } = require('pg')

module.exports = function(app){

app.post('/api/createuser', function(req, res, next) {
	 var username = req.body.username;
	 var nome = req.body.name;
	 var password = req.body.password;
	 var email = req.body.email;
	 console.log("fodeu");

	 if(!req.checkBody("email", "ERRORLOGIN").isEmail()){
	 	res.status(400).json({
                    message_class: 'error',
                    message: 'ERRORCREATEEMAIL'
                });
	 }
	 console.log(req.body);
	 database.insertUser(email, password, username, nome)
                .then(function (user_id) {
                    res.status(200).json({
                                message: "SUCCESS"
                            });
                })



});
}

