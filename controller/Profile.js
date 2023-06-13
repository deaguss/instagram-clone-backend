const { Users } = require("../models/usersModel.js")
const { Profile } = require("../models/profileModel.js")
const path = require("path")
const fs = require("fs")
const { Op, Sequelize, where } = require("sequelize");

const getAllProfile = async(req, res) => {
    try {
        const response = await Profile.findAll({
            include: {
                model: Users,
                attributes: ['id', 'uuid','username', 'full_name']
            }
        });
        if(!response) return res.status(404).json({msg: "profile tidak ditemukan"})
        res.status(200).json(response)   
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
const getAllProfileById = async(req, res) => {
    try {
        const response = await Profile.findAll({
            include: {
                model: Users,
                attributes: ['id', 'uuid','username', 'full_name']
            },
            where: {
                uuid: req.params.id
            }
        });
        if(!response) return res.status(404).json({msg: "profile tidak ditemukan"})
        res.status(200).json(response)   
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const createProfilePic = async(req, res) => {
    if(req.files === null) return res.status(400).json({msg: "tidak ada foto"});
    const { bio, jenis_kelamin, link_web, kategori } = req.body;
    const postFile = req.files.profile_pic;
    const filesSize = postFile.data.length;
    const ext = path.extname(postFile.name).toLocaleLowerCase();
    const fileName = postFile.md5 + ext;

    const url = `${req.protocol}://${req.get("host")}/profile_img/${fileName}`;
    const allowType = ['.jpg', '.png', '.jpeg'];
    
    if(!postFile) return res.status(400).json({msg: "profile image tidak terupload"});
    if(!allowType.includes(ext)) return res.status(420).json({msg: "tidak bisa input coba dengan foto yang lain!"});
    if(filesSize > 8_000_000) return res.status(422).json({msg: "size foto tidak boleh lebih dari 8 MB"});

    postFile.mv(`./public/profile_img/${fileName}`, async(err) =>  {
        if(err) return res.status(500).json({msg: err.message})
    });

    try {
        await Profile.create({
            bio: bio,
            jenis_kelamin: jenis_kelamin,
            link_web: link_web,
            kategori: kategori,
            url_pic: url,
            profile_pic: fileName,
            userId: req.userId
        })
        res.status(201).json({msg: "profile created!"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
    
}

const updateProfile = async(req, res) => {
    const profile = await Profile.findOne({
        where: {
            [Op.and]: [{uuid: req.params.id}, { userId: req.userId}]
        }
    })
    
    let fileNameDb = profile.profile_pic;
    if(req.files && req.files.profile_pic){
        const postFile = req.files.profile_pic;
        const filesSize = postFile.data.length;
        const ext = path.extname(postFile.name).toLocaleLowerCase();
        fileNameDb = postFile.md5 + ext;

        const allowType = ['.jpg', '.png', '.jpeg'];
        
        if(!fileNameDb) return req.status(400).json({msg: "foto profile tidak terupload"})
        if(!allowType.includes(ext)) return res.status(420).json({msg: "tidak bisa input coba dengan foto yang lain!"});
        if(filesSize > 8_000_000) return res.status(422).json({msg: "size foto tidak boleh lebih dari 8 MB"});

        const filePath = `./public/profile_img/${fileNameDb}`;
        try {
            fs.unlinkSync(filePath);   
        } catch (error) {
            console.log(error.message)
        }
        postFile.mv(`./public/profile_img/${fileNameDb}`, async(err) =>  {
            if(err) return res.status(500).json({msg: err.message})
        });

    }
    const { bio, jenis_kelamin, link_web, kategori } = req.body;
    const url = `${req.protocol}://${req.get("host")}/profile_img/${fileNameDb}`;
    try {
        await Profile.update({
            bio: bio,
            jenis_kelamin: jenis_kelamin,
            link_web: link_web,
            kategori: kategori,
            url_pic: url,
            profile_pic: fileNameDb
        }
        ,
        {
        where: {
            [Op.and]: [{uuid: profile.uuid}, { userId: req.userId}]
        }})
        res.status(201).json({msg: "profile updated"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const deleteProfile = async(req, res) => {
    const profile = await Profile.findOne({
        where: {
            [Op.and]: [{uuid: req.params.id}, { userId: req.userId}]
        }
    })
    if(!profile) return res.status(404).json({msg: "foto tidak ditemukan"});
    try {
        const filePath = `./public/profile_img/${profile.profile_pic}`;
        try {
            fs.unlinkSync(filePath);   
        } catch (error) {
            console.log(error.message)
        }
        await Profile.destroy({
        where: {
            [Op.and]: [{uuid: profile.uuid}, { userId: req.userId}]
        }})
        res.status(201).json({msg: "profile deleted!"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

module.exports = { getAllProfile, createProfilePic, getAllProfileById, updateProfile, deleteProfile }