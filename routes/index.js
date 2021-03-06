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

	 if(!(req.checkBody("email", "ERRORLOGIN").isEmail())){
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

app.get('/api/v2/prodexists', function(req, res, next) {

var scancode = req.query.scan;

 database.prodexists(scancode)
                .then(function (local) {
                    res.status(200).send(local.rows);
                })
                .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERROR PRODUCT"
                    })})


});

app.get('/api/v2/inserting', function(req, res, next) {

var name = req.query.name;
var description = req.query.description;
var danger = req.query.danger;

 database.inserting(name,description,danger)
                .then(function (local) {
                    res.status(200).send(local.rows);
                })
                .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERROR PRODUCT"
                    })})


});

app.get('/api/v2/geting', function(req, res, next) {

 database.geting()
                .then(function (local) {
                    var temp = 0;
                    var novoarray =[];
                    for(temp = 0;temp < local.rows.length;temp++){
                        novoarray.push(local.rows[temp].name.toString());

                    }
                    var string = "{" + novoarray.toString() + "}";

                    res.status(200).send(string);
                })
                .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERROR PRODUCT"
                    })})


});

app.get('/api/v2/uploadimage', function(req, res, next) {
    //SÓ FUNCIONA COM POST
     // Save base64 image to disk
    try
    {
        // Decoding base-64 image
        // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file
        function decodeBase64Image(dataString) 
        {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          var response = {};

          if (matches.length !== 3) 
          {
            return new Error('Invalid input string');
          }

          response.type = matches[1];
          response.data = new Buffer(matches[2], 'base64');

          return response;
        }

        // Regular expression for image type:
        // This regular image extracts the "jpeg" from "image/jpeg"
        var imageTypeRegularExpression      = /\/(.*?)$/;      

        // Generate random string
        var crypto                          = require('crypto');
        var seed                            = crypto.randomBytes(20);
        var uniqueSHA1String                = crypto
                                               .createHash('sha1')
                                                .update(seed)
                                                 .digest('hex');

        var base64Data = req.query.image;

        var imageBuffer                      = decodeBase64Image(base64Data);
        var userUploadedFeedMessagesLocation = '../img/upload/feed/';

        var uniqueRandomImageName            = 'image-' + uniqueSHA1String;
        // This variable is actually an array which has 5 values,
        // The [1] value is the real image extension
        var imageTypeDetected                = imageBuffer
                                                .type
                                                 .match(imageTypeRegularExpression);

        var userUploadedImagePath            = userUploadedFeedMessagesLocation + 
                                               uniqueRandomImageName +
                                               '.' + 
                                               imageTypeDetected[1];

        // Save decoded binary image to disk
        try
        {
        require('fs').writeFile(userUploadedImagePath, imageBuffer.data,  
                                function() 
                                {
                                  console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                                });
        }
        catch(error)
        {
            console.log('ERROR:', error);
        }

    }
    catch(error)
    {
        console.log('ERROR:', error);
    }


});


app.get('/api/v2/uploadata/', function(req, res, next) {

var device = req.query.device;
var supermarket = req.query.supermarket;
var scan = req.query.scan;
var name = req.query.name;
var ingredientes = req.query.ingredientes;

console.log("name: " + name);
  console.log("refencia:" + scan);
 console.log("supermarket:" + supermarket);
   console.log("device:" + device); 
  console.log("ingredientes:" + ingredientes);

 database.uploadata(device,supermarket,scan,name,ingredientes)
                .then(function (local) {
                     res.status(200).json({
                                message: "SUCCESS"
                            });
                }).catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERROR PRODUCT"
                    })});

});

app.get('/api/v2/getpending', function(req, res, next) {

 database.getpending()
                .then(function (local) {
                     res.status(200).send(local.rows);
                })

});

app.get('/api/v2/insertprod', function(req, res, next) {

var scancode = req.query.scan;
var nome = req.query.name;

 database.insertprod(scancode,nome)
                .then(function (local) {
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
                            })  .catch(function (err) {
                           res.status(406).json({
                        message_class: 'error',
                        message: "ERROR PRODUCT"
                    })});

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
                                    if(user_id.rows[0].sum == null){
                                         res.status(200).json([{
                                sum: "0"
                            }]);
                                     }
                                     else{
                               res.status(200).send(user_id.rows);
                           }
                            });
               

});

app.post('/api/getper', function(req, res, next) {
    var id = req.body.id;
    
         database.getper(id)
                .then(function (user_id) {
                     if(user_id.rows[0].count1 == null){
                            user_id.rows[0].count1 = 0;
                        }
                        if(user_id.rows[0].count2 == null){
                            user_id.rows[0].count2 = 0;
                        }
                        res.status(200).send(user_id.rows);
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