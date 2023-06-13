const db = require("../config/connection.js")
const { Sequelize } = require("sequelize")
const { Users } = require("./usersModel.js")
const { Posts } = require("./postModel.js")

const { DataTypes } = Sequelize;

const Like_post = db.define('like_post', {
    like: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true
        
    },
    postId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
},
{
    freezeTableName: true
})

Users.hasMany(Like_post)
Like_post.belongsTo(Users, {foreignKey: 'userId'})
Posts.hasMany(Like_post)
Like_post.belongsTo(Posts, {foreignKey: 'postId'})

module.exports = { Like_post }