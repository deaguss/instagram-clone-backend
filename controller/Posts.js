const { Users } = require("../models/usersModel.js")
const { Posts } = require("../models/postModel.js")
const path = require("path")
const fs = require("fs")
const { Op, Sequelize } = require("sequelize");

const getAllPosts = async(req, res) => {
    try {
        const response = await Posts.findAll({
            attributes: [
                'id','uuid', 'post', 'caption', 'location', 'url','createdAt','updatedAt'],
            include: {
                model: Users,
                attributes: ['id', 'uuid','username']
            }
        });
        if(!response) return res.status(404).json({msg: "foto tidak ditemukan"})
        res.status(200).json(response)   
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const getPostsById = async(req, res) => {
    try {
        const response = await Posts.findOne({
            attributes: ['id','uuid', 'post', 'caption', 'location', 'url','createdAt','updatedAt'],
            include: {
                model: Users,
                attributes: ['id', 'uuid','username']
            },
            where: {
                uuid: req.params.id
            }
        })
        if(!response) return res.status(404).json({msg: "foto tidak ditemukan"})
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const createPosts = async(req, res) => {
    if(req.files === null) return res.status(400).json({msg: "tidak ada foto"});
    const { caption, location } = req.body;
    const postFile = req.files.post;
    const filesSize = postFile.data.length;
    const ext = path.extname(postFile.name).toLocaleLowerCase();
    const fileName = postFile.md5 + ext;

    const url = `${req.protocol}://${req.get("host")}/img/${fileName}`;
    const allowType = ['.jpg', '.png', '.jpeg'];
    
    if(!postFile) return res.status(400).json({msg: "postingan tidak terupload"});
    if(!allowType.includes(ext)) return res.status(420).json({msg: "tidak bisa input coba dengan foto yang lain!"});
    if(filesSize > 8_000_000) return res.status(422).json({msg: "size foto tidak boleh lebih dari 8 MB"});

    postFile.mv(`./public/img/${fileName}`, async(err) =>  {
        if(err) return res.status(500).json({msg: err.message})
    });

    try {
        await Posts.create({
            caption: caption,
            location: location,
            url: url,
            post: fileName,
            userId: req.userId
        })
        res.status(201).json({msg: "postingan terupload!"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const updatePosts = async(req, res) => {
    const post = await Posts.findOne({
        where: {
            [Op.and]: [{uuid: req.params.id}, { userId: req.userId}]
        }
    })
    if(!post) return res.status(404).json({msg: "foto tidak ditemukan"});

    let fileName = post.post
    if(req.files && req.files.post){
        const postFile = req.files.post;
        const filesSize = postFile.data.length;
        const ext = path.extname(postFile.name).toLocaleLowerCase();
        const fileName = postFile.md5 + ext;

        const allowType = ['.jpg', '.png', '.jpeg'];
        
        if(!post) return res.status(400).json({msg: "postingan tidak terupload"});
        if(!allowType.includes(ext)) return res.status(420).json({msg: "tidak bisa input coba dengan foto yang lain!"});
        if(filesSize > 8_000_000) return res.status(422).json({msg: "size foto tidak boleh lebih dari 8 MB"});

        const filePath = `./public/img/${post.post}`;
        try {
            fs.unlinkSync(filePath);   
        } catch (error) {
            console.log(error.message)
        }

        postFile.mv(`./public/img/${fileName}`, async(err) =>  {
            if(err) return res.status(500).json({msg: err.message})
        });
    }
    const { caption, location } = req.body;
    const url = `${req.protocol}://${req.get("host")}/img/${fileName}`;

    try {
        await Posts.update({
            caption: caption,
            location: location,
            url: url,
            post: fileName
        }, 
        {
        where: {
            [Op.and]: [{uuid: post.uuid}, { userId: req.userId}]
        }})
        res.status(201).json({msg: "postingan updated!"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }

}

const deletePosts = async(req, res) => {
    const post = await Posts.findOne({
        where: {
            [Op.and]: [{uuid: req.params.id}, { userId: req.userId}]
        }
    })
    if(!post) return res.status(404).json({msg: "foto tidak ditemukan"});

    try {
        const filePath = `./public/img/${post.post}`;
        try {
            fs.unlinkSync(filePath);   
        } catch (error) {
            console.log(error.message)
        }

        await Posts.destroy( {
        where: {
            [Op.and]: [{uuid: post.uuid}, { userId: req.userId}]
        }})
        res.status(201).json({msg: "postingan didelete"});
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

module.exports = { getAllPosts, createPosts, getPostsById, updatePosts, deletePosts }