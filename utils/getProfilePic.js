const { Profile } = require("../models/profileModel.js")

const getProfilePic = async(req, res) => {
    const profile = await Profile.findOne({
        where: {
            userId: req.userId 
        }
    })
    return profile.profile_pic;
}

module.exports = { getProfilePic }