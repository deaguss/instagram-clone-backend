const routes = require('express').Router();
const { getAllComments, createComments, getAllCommentsByID, deleteComments } = require("../controller/Comments.js");
const { verifyUsers } = require("../middleware/AuthUsers.js")

routes.get('/comments', verifyUsers, getAllComments)
routes.get('/comments/:id', verifyUsers, getAllCommentsByID)
routes.post('/comments/:id', verifyUsers, createComments)
routes.delete('/comments/:id', verifyUsers, deleteComments)

module.exports = routes