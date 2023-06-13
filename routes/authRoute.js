const routes = require('express').Router();
const { Login, 
    LogOut, 
    Me} = require("../controller/Auth.js")

routes.get('/me', Me);
routes.post('/login', Login);
routes.delete('/logout', LogOut);

module.exports = routes