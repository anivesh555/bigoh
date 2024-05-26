
const { Sequelize } = require('sequelize');


const user = process.env.USER || 'postgres'
const host= process.env.HOST ||  'localhost'
const database= process.env.DATABASE ||  'bigoh'
const password= process.env.PASSWORD || '123'
const port= process.env.DB_PORT || 8100

const sequelize = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: 'postgres',
  logging: false,  // Disable logging; default: console.log
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
