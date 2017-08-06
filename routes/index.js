var express = require('express');
var router = express.Router();
var database = require('../models/lowdatabase');
const { Client } = require('pg')

module.exports = function(app){

    app.all('/api/*', function(req, res, next) {
    var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }


});
    

app.post('/api/createuser', function(req, res, next) {
	 var username = req.body.username;
	 var nome = req.body.name;
	 var password = req.body.password;
	 var email = req.body.email;
     var image = req.body.image;
     var fb = req.body.fb;

     if(!(fb == 1)){
         if(!isNaN(Number(username))){
        res.status(400).json({
                    message_class: 'error',
                    message: 'USERNAME CANNOT BE A NUMBER'
                });
     }
 }

	 if(!req.checkBody("email", "ERRORLOGIN").isEmail()){
	 	res.status(400).json({
                    message_class: 'error',
                    message: 'ERRORCREATEEMAIL'
                });
	 }
	 console.log(req.body);
	 database.insertUser(email, password, username, nome, image)
                .then(function (user_id) {
                    res.status(200).json({
                                message: "SUCCESS"
                            });
                })



});


app.get('/api/getusers', function(req, res, next) {


 database.getusers()
                .then(function (local) {
                    res.status(200).send(local.rows);
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

app.delete('/api/deleteuser', function(req, res, next) {
     var username = req.body.username;

     database.deleteuser(username)
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
     var image = req.body.image;

		 database.insertObjective(description,coins,nome,localname,image)
                .then(function (user_id) {
                    res.status(200).json({
                                message: "SUCCESS"
                            });
                })



});

app.post('/api/getuserbyid', function(req, res, next) {
     var id = req.body.id;

         database.getuserbyid(id)
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            })
                .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERRORLOGIN1"
                    })});



});

app.delete('/api/deleteallobj', function(req, res, next) {

         database.deleteallobj()
                .then(function (user_id) {
                    res.status(200).json({
                                message: "SUCCESS"
                            });
                })



});


app.post('/api/login', function(req, res, next) {
     var username = req.body.username;
     var password = req.body.password;

     if(!isNaN(Number(username))){
        res.status(400).json({
                    message_class: 'error',
                    message: 'USERNAME CANNOT BE A NUMBER'
                });
     }


         database.login(username,password)
                .then(function (user_id) {
                   res.status(200).send((user_id[0].id).toString());
                })
                 .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERRORLOGIN1"
                    })});



});

app.get('/api/getlatobj', function(req, res, next) {

      //     var latest = req.query.latest;
                var latest = 3;
         database.getlatest(latest)
                .then(function (user_id) {
                   res.status(200).send(user_id);
                })
                 .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERRORLOGIN1"
                    })});



});


app.get('/api/getallobj', function(req, res, next) {
	
		 database.getObjectives()
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            });
               



});

app.post('/api/getuser', function(req, res, next) {
    
        var username = req.body.username;

         database.getuser(username)
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            }).catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERRORLOGIN1"
                    })});
               



});


app.post('/api/insertobjcom', function(req, res, next) {
          var userid = req.body.userid;
          var objid = req.body.objid;

         database.insertobjcom(userid,objid)
                .then(function (user_id) {           
                                     res.status(200).json({
                                message: "SUCCESS"
                            });
                            });
               



});



app.post('/api/getobjbyid', function(req, res, next) {
    var id = req.body.id;
    
         database.getobjbyid(id)
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            });
               



});

app.post('/api/getcoinsbyid', function(req, res, next) {
    var id = req.body.id;
    
         database.getcoinsbyid(id)
                .then(function (user_id) {         
                                console.log(user_id.rows[0]['sum']);
                                    if(user_id.rows[0].sum == "null"){
                                         res.status(200).json({
                                sum: 0
                            });
                                     }
                                     else{
                               res.status(200).send(user_id.rows);
                           }
                            });
               

});


app.delete('/api/deleteobjcomp', function(req, res, next) {
    
         database.deleteobjcomp()
                .then(function (user_id) {           
                                  res.status(200).json({
                                message: "SUCCESS"
                            });
                            });
               



});

app.post('/api/getnotobjbyid', function(req, res, next) {
    var id = req.body.id;
    
         database.getnotobjbyid(id)
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            });
               



});

app.post('/api/getnotobjbyids', function(req, res, next) {
    var id = req.body.id;
    
         database.getnotobjbyids(id)
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            });
               



});

app.post('/api/getimgbyid', function(req, res, next) {
    var id = req.body.id;
    
         database.getimgbyid(id)
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            });
            

});

app.post('/api/getnotimgbyid', function(req, res, next) {
    var id = req.body.id;
    
         database.getnotimgbyid(id)
                .then(function (user_id) {           
                               res.status(200).send(user_id.rows);
                            });
            

});


}