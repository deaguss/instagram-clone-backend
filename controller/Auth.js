const { Users } = require("../models/usersModel");
const argon2 = require("argon2");

const Login = async(req, res) => {
    let user;
    
    if(req.body.email){
        user = await Users.findOne({
            where: {
                email: req.body.email,
            }
        });
    }
    if(!user && req.body.phone_number){
        user = await Users.findOne({
            where: {
                phone_number: req.body.phone_number,
            }
        });
    }
    if(!user && req.body.username){
        user = await Users.findOne({
            where: {
                username: req.body.username,
            }
        });
    }
    if(!req.body.email && !req.body.phone_number && !req.body.username) return res.status(400).json({msg: "mohon masukan email, username atau phone number"});
    if(!user) return res.status(404).json({msg: "username, email atau phone number salah!"});

    const match = await argon2.verify(user.passsword, req.body.password);
    if(!match) return res.status(400).json({msg: "password salah!"});

    req.session.userId = user.uuid;

    const { uuid, email, phone_number, full_name, username } = user;
    res.status(200).json({uuid, email, phone_number, full_name, username});
}

const Me = async(req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "mohon login terlebih dahulu"});
    }
    const user = await Users.findOne({
        attributes: ['uuid', 'email', 'phone_number', 'full_name', 'username']
        ,
        where: {
            uuid: req.session.userId
        }
    })
    if(!user) return res.status(404).json({msg: "account tidak ditemukan"});
    res.status(200).json(user);
}

const LogOut = (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "tidak bisa logout"});
        res.status(200).json({msg: "anda telah logout"})
    })
}

module.exports = { Login, Me, LogOut }