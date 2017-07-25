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

app.post('/api/createlocal', function(req, res, next) {
	 var description = req.body.description;
	 var imagelink = req.body.image;
	 var lat = req.body.lat;
	 var long = req.body.long;

	 database.insertLocal(description,imagelink,lat,long)
                .then(function (user_id) {
                    res.status(200).json({
                                message: "SUCCESS"
                            });
                })



});

app.delete('/api/deletelocal', function(req, res, next) {
	 var description = req.body.description;

	 database.deleteLocal(description)
                .then(function (user_id) {
                    res.status(200).json({
                                message: "SUCCESS"
                            });
                })

});


app.get('/api/getlocals', function(req, res, next) {
	
	 database.getLocals()
                .then(function (local) {
                    res.status(200).send(local.rows);
                })



});

app.post('/api/createobj', function(req, res, next) {
	 var description = req.body.description;
	 var coins = req.body.coins;
	 var nome = req.body.name;
	 var localname = req.body.lname;

		 database.insertObjective(description,coins,nome,localname)
                .then(function (user_id) {
                    res.status(200).json({
                                message: "SUCCESS"
                            });
                })



});

app.post('/api/login', function(req, res, next) {
     var username = req.body.username;
     var password = req.body.password;

         database.login(username,password)
                .then(function (user_id) {
                   res.status(200).send(user_id.id);
                })
                 .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERRORLOGIN1"
                    })});



});

app.get('/api/getobj', function(req, res, next) {
	
		 database.getObjectives()
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            });
               



});

}