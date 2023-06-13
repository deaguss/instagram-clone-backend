const routes = require('express').Router();
const { getAllProfile, createProfilePic, getAllProfileById, updateProfile, deleteProfile } = require("../controller/Profile.js")
const { verifyUsers } = require("../middleware/AuthUsers.js");
const { getProfilePic } = require("../utils/getProfilePic.js")

routes.get('/profile', verifyUsers, getAllProfile);
routes.get('/profile/:id', verifyUsers, getAllProfileById);
// routes.post('/profile', verifyUsers, (req, res) =>{
//     if(!getProfilePic){
//         createProfilePic()
//     }else{
//             const userId = req.params.id;
//             res.redirect(`profile/${userId}`)  
//     }
// });
routes.post('/profile', verifyUsers, createProfilePic);
routes.patch('/profile/:id', verifyUsers, updateProfile);
routes.delete('/profile/:id', verifyUsers, deleteProfile);

module.exports = routes