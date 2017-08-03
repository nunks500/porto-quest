
   var bcrypt = require('bcrypt-nodejs'),
   Promise = require('bluebird')
    crypto = require('crypto');
    const { Client } = require('pg')

const client = new Client({
  host: 'ec2-54-75-229-201.eu-west-1.compute.amazonaws.com',
  port: 5432,
  user: 'dnotxjqbmdxpql',
  password: '3abcbb31a458a9e9a588faa6a63ef854359f34e07c090df4ee0b814a6236a481',
  ssl:true,
  database:'df4udlkbngrdct'
})

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected');
  }
})

 exports.insertUser = function (email, password, username, name) {
        return new Promise(function (resolve, reject) {
            bcrypt.hash(password, null, null, function (err, hash) {
                if (err) {
                    reject(err);
                } else {
                    crypto.randomBytes(20, function (err, buf) {
                        if (err) {
                            reject(err);
                        } else {
                        	client.query("INSERT INTO utilizador(username,password,nome,email,image,token) VALUES ($1, $2, $3 ,$4, $5, $6)",[username, hash, name, email,'default.jpg', buf.toString('hex')],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result.insertId);
      
                                    }
                                });


                        }
                    });
                }
            });
        });
    }

     exports.insertLocal = function (description,imagelink,lat,long) {
       return new Promise(function (resolve, reject) {
                          client.query("INSERT INTO local(description,image,lat,long) VALUES ($1, $2, $3, $4)",[description,imagelink,lat,long],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result.insertId);
      
                                    }
                                });
                        });

    }

    exports.getLocals = function (description,imagelink,lat,long) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT * FROM local",
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }
       exports.deleteLocal = function (description) {
       return new Promise(function (resolve, reject) {
                          client.query("DELETE FROM local WHERE description= $1",[description],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }

          exports.insertObjective = function (description,coins,nome,localname,image) {
            return new Promise(function (resolve, reject) {
                          client.query("SELECT id FROM local WHERE description = $1",[localname],
                          function (err, result) {
                                    if (err) {
                                        res.status(404).json({
                                        message: "ID not found"
                                        });
                                    } else {                          
                                       client.query("INSERT INTO objetivos(description, image, coins, nome, localid) VALUES ($1, $2 ,$3, $4, $5)",[description, image, coins, nome, result.rows[0].id],
                                        function (err2, result2) {
                                    if (err2) {
                                        reject(err2);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        console.log("saí");
                                        resolve(result2);
      
                                    }
                                });
                          
      
                                    }
                                });
                                      });
                         
    }

        exports.getObjectives = function () {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT * FROM objetivos",
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }

    exports.getobjbyid = function (id) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT lat,long as lng FROM objetivoscompletos,objetivos,local WHERE utilizadorid = $1 and objetivos.id = objetivoscompletos.objectid and local.id = objetivos.localid",[id],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }

        exports.getnotobjbyid = function (id) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT lat,long as lng FROM objetivos,local WHERE local.id = objetivos.localid EXCEPT SELECT lat,long as lng FROM objetivoscompletos,objetivos,local WHERE utilizadorid = $1 and objetivos.id = objetivoscompletos.objectid and local.id = objetivos.localid",[id],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }

     exports.deleteobjcomp = function (id) {
       return new Promise(function (resolve, reject) {
                          client.query("DELETE FROM objetivoscompletos",
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }


            exports.getnotobjbyids = function (id) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT lat,long as lng,objetivos.id,objetivos.coins,objetivos.nome FROM objetivos,local WHERE local.id = objetivos.localid EXCEPT SELECT lat,long as lng,objetivos.id,objetivos.coins,objetivos.nome  FROM objetivoscompletos,objetivos,local WHERE utilizadorid = $1 and objetivos.id = objetivoscompletos.objectid and local.id = objetivos.localid",[id],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }



        exports.getimgbyid = function (id) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT local.image,local.description,objetivos.description as obj FROM objetivoscompletos,objetivos,local WHERE utilizadorid = $1 and objetivos.id = objetivoscompletos.objectid and local.id = objetivos.localid",[id],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }

     exports.getnotimgbyid = function (id) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT local.image,local.description,objetivos.description as obj FROM objetivos,local WHERE local.id = objetivos.localid EXCEPT SELECT local.image,local.description,objetivos.description as obj FROM objetivoscompletos,objetivos,local WHERE utilizadorid = $1 and objetivos.id = objetivoscompletos.objectid and local.id = objetivos.localid",[id],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }


    exports.insertobjcom = function (userid,objectid) {
       return new Promise(function (resolve, reject) {
                          client.query("INSERT INTO objetivoscompletos(objectid, utilizadorid) VALUES($1,$2)",[objectid,userid],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }


    exports.deleteallobj = function () {
       return new Promise(function (resolve, reject) {
                          client.query("DELETE from objetivos",
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result);
      
                                    }
                                });
                          });
    }


            exports.getlatest = function (latest) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT objetivos.description,objetivos.coins,objetivos.image,objetivos.nome FROM objetivos order by objetivos.id desc limit $1",[latest],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                     // console.log(result.rows[0].name);
                                        resolve(result.rows);
      
                                    }
                                });
                          });
    }


           exports.login = function (username,password) {
       return new Promise(function (resolve, reject) {
                          client.query("SELECT * FROM utilizador where username = $1",[username],
                          function (err, result) {
                                    if (err) {
                                        reject(err);
                                    } else {
              
                                      if(result.rows.length > 0){
                                       
                                bcrypt.compare(password, result.rows[0].password,
                                function (err, res) {
                                    if (err) {
                                        reject(err);
                                    } else if (res === true) {
                                        delete result.rows[0]._password;
                                        resolve(result.rows);
                                    } else if (res === false) {
                                        reject('Incorrect password.');
                                    }
                                });   
                                    }
                                    else
                                reject('User does not exist.');
                                  }
                                });
                          });
    }

