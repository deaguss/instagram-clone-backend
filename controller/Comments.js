const { Users } = require("../models/usersModel.js")
const { Posts } = require("../models/postModel.js")
const { Comments } = require("../models/commentsModel.js")

const getAllComments = async(req, res) => {
    try {
        const response  = await Comments.findAll({
            attributes: ['id', 'uuid', 'like', 'likeCount', 'comment', 'createdAt'],
            include: [
                { 
                    model: Posts,
                    attributes: ['id', 'uuid', 'post', 'caption']
                },
                {
                    model: Users,
                    attributes: ['id', 'uuid', 'username']
                }
            ]
        })
        if(!response) return res.status(404).json({msg: "tidak ada postingan atau komen"})
        res.status(200).json(response)   
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const getAllCommentsByID = async(req, res) => {
    try {
        const response  = await Comments.findOne({
            where: {
                uuid: req.params.id
            },
            attributes: ['id', 'uuid', 'like', 'likeCount', 'comment', 'createdAt'],
            include: [
                { 
                    model: Posts,
                    attributes: ['id', 'uuid', 'post', 'caption']
                },
                {
                    model: Users,
                    attributes: ['id', 'uuid', 'username']
                }
            ]
        })
        if(!response) return res.status(404).json({msg: "tidak ada postingan atau komen"})
        res.status(200).json(response)   
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const createComments = async(req, res) => {
    const { comments } = req.body;
    const post = await Posts.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!comments || comments === "" || comments.length > 250) return res.status(400).json({msg: "komen tidak boleh kosong dan tidak boleh lebih dari 250 kata"});
    try {
        if(!req.userId) return res.status(401).json({msg: "user tidak terontetikasi"})
        const response = await Comments.create({
            comment: comments, 
            userId: req.userId,
            postId: post.id
        });
        if(!response) return res.status(401).json({msg: "tidak upload komen"});
        res.status(200).json({msg: "berhasil komen"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const deleteComments = async(req, res) => {
    try {
        await Comments.destroy({
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json({msg: "komen berhasil dihapus"})   
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

module.exports = { getAllComments, createComments, getAllCommentsByID, deleteComments }