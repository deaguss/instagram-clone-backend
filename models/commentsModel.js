const db = require("../config/connection.js")
const { Sequelize } = require("sequelize")
const { Users } = require("./usersModel.js")
const { Posts } = require("./postModel.js")

const { DataTypes } = Sequelize;

const Comments = db.define('comments', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    like: {
        type: DataTypes.BOOLEAN
    },
    likeCount: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.TEXT
    },
    userId: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true
        }
    },
    postId: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true
        }
    }
},
{
    freezeTableName: true
})

Users.hasMany(Comments)
Comments.belongsTo(Users, {foreignKey: 'userId'})
Posts.hasMany(Comments)
Comments.belongsTo(Posts, {foreignKey: 'postId'})

module.exports = { Comments }