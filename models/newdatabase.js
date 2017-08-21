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

client.query('DROP TABLE IF EXISTS products cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

  client.query('DROP TABLE IF EXISTS ingerdientineach cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

  client.query('DROP TABLE IF EXISTS ingredients cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

    client.query('DROP TABLE IF EXISTS pending cascade')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))

client.query('CREATE TABLE products(id SERIAL PRIMARY KEY, referencia int not null UNIQUE, name VARCHAR(150) not null)')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))
 // .then(() => client.end())

 client.query('CREATE TABLE ingredients(id SERIAL PRIMARY KEY, name VARCHAR(150) not null, description VARCHAR(250) not null, danger VARCHAR(2) not null)')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))
 // .then(() => client.end())

  client.query('CREATE TABLE pending(id SERIAL PRIMARY KEY, name VARCHAR(150) not null, referencia int not null UNIQUE, ingredientes VARCHAR(5000) not null,image VARCHAR(150))')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))
 // .then(() => client.end())

  client.query('CREATE TABLE ingerdientineach(id SERIAL PRIMARY KEY, productid int REFERENCES products(id), ingredientsid int REFERENCES ingredients(id))')
  .then(result => console.log(result))
  .catch(e => console.error(e.stack))
  .then(() => client.end())
