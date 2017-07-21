
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
                        }

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
                          }
    }

