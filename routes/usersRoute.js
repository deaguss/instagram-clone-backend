const routes = require('express').Router();
const { getAllUsers, 
    createUsers, 
    getUsersByid, 
    updateUsers, 
    deleteUsers } = require("../controller/Users.js");
const { verifyUsers } = require("../middleware/AuthUsers.js");

routes.get('/users', verifyUsers,getAllUsers)
routes.get('/users/:id', verifyUsers,getUsersByid)
routes.patch('/users/:id', verifyUsers,updateUsers)
routes.post('/users',createUsers)
routes.delete('/users/:id', verifyUsers,deleteUsers)

module.exports = routes
