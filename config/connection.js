const { Sequelize } = require("sequelize");
require("dotenv").config()

const db = new Sequelize(`${process.env.APP_DB_NAME}`,
    `${process.env.APP_DB_USERNAME}`, 
    `${process.env.APP_DB_PASS}`, {
    host: `${process.env.APP_DB_HOST}`,
    dialect: `${process.env.APP_DB_DIALECT}`
})

module.exports = db