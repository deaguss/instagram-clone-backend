const routes = require('express').Router();
const { getAllPosts, 
    createPosts, 
    getPostsById,
    updatePosts,
    deletePosts } = require("../controller/Posts.js");
const { verifyUsers } = require("../middleware/AuthUsers.js");

routes.get('/create', verifyUsers,getAllPosts)
routes.get('/create/:id', verifyUsers,getPostsById)
routes.post('/create', verifyUsers,createPosts)
routes.patch('/create/:id', verifyUsers, updatePosts)
routes.delete('/create/:id', verifyUsers, deletePosts)

module.exports = routes