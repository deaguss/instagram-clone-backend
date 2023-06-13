const { Users } = require("../models/usersModel.js");

const verifyUsers = async(req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "mohon login terlebih dahulu"});
    }
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json({msg: "account tidak ditemukan"});
    req.userId = user.id;
    next();
}

module.exports = { verifyUsers }