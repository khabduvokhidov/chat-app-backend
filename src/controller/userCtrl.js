const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const User = require("../models/userModel")

const userCtrl = {
    // Get a user
    getUser: async (req, res) => {
        const {id} = req.params
        try {
            const user = await User.findById(id)
            if(user){
                const {password, ...otherdetals} = user._doc
                return res.status(200).json(otherdetals)
            }
            res.status(404).json("no such User")
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },
    
    // get all user
    getAllUser: async(req, res)=>{
        try {
            let users = await User.find()
            users = users.map((user)=> {
                const {password, ...otherdetals} = user._doc
                return otherdetals
            })

            res.status(200).json(users)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    // update a user 
    updateUser: async(req, res) => {
        const {id} = req.params
        const{userId, password} = req.body
        try {
            if(id === userId){
                if(password){
                    const heshPassword = await bcrypt.hash(password, 10)
                    req.body.password = heshPassword
                }
                const user = await User.findByIdAndUpdate(id, req.body, {new: true})

                const token = JWT.sign({user: user.username, id: userId}, process.env.JWT_SECRET_KEY, {expiresIn: "2h"})

                res.status(200).json({user, token})
            }else{
                res.status(403).json("Access Deind! You can update only yyour own Account.")
            }
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    // delete a user
    deleteUser: async(req, res) => {
        const {id} = req.params
        const {userId, curenntAdmin} = req.body
        
        if(id === userId || curenntAdmin){
            try {
                await User.findByIdAndDelete(id)
                res.status(200).json("user delete succssfely")
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        }else{
            res.status(403).json("Access Deind! You can delete only your own Account.")
        }
    },

    // Follow a User
    followUser: async(req,res) =>{
        const {id} = req.params
        const {userId} = req.body

        if(id === userId) {
            res.status(403).json("action forbiden")
        }else{
            try {
                const followUser = await User.findById(id)
                const followingUser = await User.findById(userId)

                if(!followUser.followers.includes(userId)){
                    await followUser.updateOne({$push: {followers: userId}})

                    await followingUser.updateOne({$push: {following: id}})

                    res.status(200).json("user followed!")
                }else{
                    res.status(403).json("you already following this user")
                }
                
            } catch (error) {
                res.status(500).json({message: error.message})
            }
        }
    },

    // unfollowing User

    unfollowUser: async(req, res) => {
        const {id} = req.params

        const {userId} = req.body

        if(id === userId){
            res.status(403).json("Action forbiden")
        }else{
            try {
                const unFollowUser = await User.findById(id)
                const unFollowingUser = await User.findById(userId)

                if(unFollowUser.followers.includes(userId)){
                    await unFollowUser.updateOne({$pull: {followers: userId}})

                    await unFollowingUser.updateOne({$pull: {following: id}})

                    res.status(200).json("unfollowed successfully")
                }else{
                    res.status(403).json("You are not following this user.")
                }

            } catch (error) {
                res.status(500).json({message: error.message})
            }
        }
    }
}

module.exports = userCtrl