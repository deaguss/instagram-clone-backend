const routes = require('express').Router();
const { verifyUsers } = require("../middleware/AuthUsers.js")
const { getAllLikePost, createLike, deleteLike, getLikeByIdPost } = require("../controller/likePost.js")

routes.get('/like', verifyUsers, getAllLikePost);
routes.get('/like/:id', verifyUsers, getLikeByIdPost);
routes.post('/like/:id', verifyUsers, createLike);
routes.delete('/like/:id', verifyUsers, deleteLike);


module.exports = routes;