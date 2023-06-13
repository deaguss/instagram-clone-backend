const { Like_post } = require("../models/LikePostModel.js")
const { Posts } = require("../models/postModel.js")
const { Users } = require("../models/usersModel.js")
const { Op, Sequelize } = require("sequelize");


const getAllLikePost = async(req, res)=> {
    try {
        const response = await Like_post.findAll({
            attributes:['like', 'userId', 'postId'],
            include: [
                {
                    model: Posts,
                    attributes: ['id', 'uuid', 'url']
                },
                {
                    model: Users,
                    attributes: ['id', 'uuid', 'username']
                }
            ]
        })
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const getLikeByIdPost = async(req, res) => {
    const post = await Posts.findOne({
        where: {
            uuid: req.params.id
        }
    });
    try {
        const response = await Like_post.findOne({
            where: {
                postId: post.id
            },
            attributes:['like', 'userId', 'postId'],
            include: [
                {
                    model: Posts,
                    attributes: ['id', 'uuid', 'url']
                },
                {
                    model: Users,
                    attributes: ['id', 'uuid', 'username']
                }
            ]
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

const createLike = async(req, res) => {
    const post = await Posts.findOne({
        where: {
            uuid: req.params.id
        }
    });
    try {
        await Like_post.create({
            like: true,
            userId: req.userId,
            postId: post.id
        })
        res.status(200).json({msg: "liked"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

const deleteLike = async(req, res)=> {
    const post = await Posts.findOne({
        where: {
            uuid: req.params.id
        }
    });
    try {
        await Like_post.destroy({
            where: {
                userId: req.userId,
                postId: post.id
            }
        })
        res.status(200).json({msg: "unliked"});
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

module.exports = { getAllLikePost, createLike, deleteLike, getLikeByIdPost }