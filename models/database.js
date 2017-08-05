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

client.query('DROP TABLE IF EXISTS utilizador cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

  client.query('DROP TABLE IF EXISTS local cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

client.query('DROP TABLE IF EXISTS objetivos cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

client.query('DROP TABLE IF EXISTS objetivoscompletos cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

client.query('CREATE TABLE utilizador(id SERIAL PRIMARY KEY, username VARCHAR(50) not null UNIQUE, password VARCHAR(256) not null, nome VARCHAR(50) not null, email VARCHAR(70) not null,image varchar(200) not null, token varchar(200) NOT NULL)')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))
 // .then(() => client.end())

   client.query('CREATE TABLE local(id SERIAL PRIMARY KEY, description VARCHAR(50) not null, image varchar(200) not null,lat FLOAT not null, long FLOAT not null)')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

  client.query('CREATE TABLE objetivos(id SERIAL PRIMARY KEY, description VARCHAR(50) not null,image varchar(200) not null, coins int not null, nome VARCHAR(15) not null, localid int REFERENCES local(id))')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

 client.query('CREATE TABLE objetivoscompletos(id SERIAL PRIMARY KEY, objectid int REFERENCES objetivos(id), utilizadorid int REFERENCES utilizador(id))')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))
  .then(() => client.end())


