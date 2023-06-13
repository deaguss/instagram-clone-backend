const db = require("../config/connection.js")
const { Sequelize } = require("sequelize")
const { Users } = require("./usersModel.js")

const { DataTypes } = Sequelize;
const Profile = db.define('profile', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    profile_pic: {
        type: DataTypes.STRING
    },
    url_pic: {
        type: DataTypes.STRING
    },
    bio: {
        type: DataTypes.TEXT
    },
    link_web: {
        type: DataTypes.STRING
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('wanita', 'pria')
    },
    kategori: {
        type: DataTypes.TEXT
    },
    jumlah_follower: {
        type: DataTypes.INTEGER
    },
    mengikuti: {
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.UUIDV4,
        validate: {
            notEmpty: true
        }
    }
},
{
    freezeTableName: true
})

Users.hasMany(Profile)
Profile.belongsTo(Users, {foreignKey: 'userId'})

module.exports = { Profile }