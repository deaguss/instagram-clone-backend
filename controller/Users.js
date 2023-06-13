const { Users } = require("../models/usersModel.js")
const argon2 = require("argon2");

const getAllUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['id', 'uuid', 'email', 'phone_number', 'full_name', 'username']
        });
        res.status(200).json(response)   
    } catch (error) {
        res.status(500).json({msg: error.message, err: "ada error pada server"})
    }
}


const getUsersByid = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['id', 'uuid', 'email', 'phone_number', 'full_name', 'username'],
            where: { uuid : req.params.id }
        })
        if(!response) return res.status(400).json({msg: "data user tidak ditemukan"})
        res.status(200).json(response)   
    } catch (error) {
        res.status(500).json({msg: error.message, err: "ada error pada server"})
    }
}

const createUsers = async(req, res) => {
    const { email, phone_number, full_name, username, password } = req.body

    if(password === null || password === "" || password.length < 6) return res.status(400).json({msg: "password tidak boleh kosong dan harus lebih dari 6 kata!"});

    if(!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({msg: "Email tidak valid"});

    if(!full_name || full_name.trim().length === 0) return res.status(400).json({msg: "nama lengkap tidak boleh kosong"});

    if(!username || username.trim().length < 4 || username.trim().length >= 20) return res.status(400).json({msg: "username harus terdiri dari 4-20 karakter"});

    if(!phone_number || !/^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$/.test(phone_number)) return res.status(400).json({msg: "nomor telepon tidak valid"})

    const hashPw = await argon2.hash(password)
    try {
        await Users.create({
            email: email,
            phone_number: phone_number,
            full_name: full_name,
            username: username,
            passsword: hashPw
        })
        res.status(201).json({msg: "berhasil mendaftar"})   
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

const updateUsers = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if(!user) return res.status(404).json({msg: "data user tidak ditemukan"});

    const { email, phone_number, full_name, username, password } = req.body

    let hashPw;
    if(password === null || password === ""){
        hashPw = user.passsword
    }else {
        hashPw = await argon2.hash(password)
    }

    if(password === null || password === "" || password.length < 6) return res.status(400).json({msg: "password tidak boleh kosong dan harus lebih dari 6 kata!"});

    if(!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({msg: "Email tidak valid"});

    if(!full_name || full_name.trim().length === 0) return res.status(400).json({msg: "nama lengkap tidak boleh kosong"});

    if(!username || username.trim().length < 4 || username.trim().length >= 20) return res.status(400).json({msg: "username harus terdiri dari 4-20 karakter"});

    if(!phone_number || !/^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$/.test(phone_number)) return res.status(400).json({msg: "nomor telepon tidak valid"})

    try {
        await Users.update({
            email: email,
            phone_number: phone_number,
            full_name: full_name,
            username: username,
            passsword: hashPw
        },
        {
            where: {
                id: user.id
            }
        })
        res.status(201).json({msg: "berhasil update account"})   
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

const deleteUsers = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if(!user) return res.status(404).json({msg: "data user tidak ditemukan"});
    try {
        await Users.destroy(
        {
            where: {
                id: user.id
            }
        })
        res.status(201).json({msg: "berhasil menghapus accounts"})   
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

module.exports = { getAllUsers, createUsers, getUsersByid, updateUsers, deleteUsers }