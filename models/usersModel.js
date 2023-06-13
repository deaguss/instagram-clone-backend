const db = require("../config/connection.js")
const { Sequelize } = require("sequelize")

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.TEXT,
        defaultValue: DataTypes.UUIDV4,
        validate: {
            isEmail: true
        }
    },
    phone_number: {
        type: DataTypes.TEXT,
        defaultValue: DataTypes.UUIDV4
    },
    full_name: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    username: {
        type: DataTypes.TEXT,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    passsword: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
},
{
    freezeTableName: true
})

module.exports = { Users }