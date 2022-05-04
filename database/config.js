const { Sequelize } = require('sequelize');



const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.HOST,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    logging: false
})


module.exports = { db };