const db = require("../config/connection.js")
const { Sequelize } = require("sequelize")
const { Users } = require("./usersModel.js")

const { DataTypes } = Sequelize;
const Posts = db.define('post', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    post: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    url: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4
    },
    caption: {
        type: DataTypes.TEXT,
        validate: {
            len: [0, 2200]
        }
    },
    location: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true
        }
    }
},
{
    freezeTableName: true
})

Users.hasMany(Posts)
Posts.belongsTo(Users, {foreignKey: 'userId'})

module.exports = { Posts }