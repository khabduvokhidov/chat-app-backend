const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const User = require("../models/userModel")

const authCtrl = {
    // Register new user
    registerUser: async (req, res) =>{
        const {username, password} = req.body
        console.log(username, password);
        try {
            const oldUser = await User.findOne({username})
            if(oldUser) {
               return res.status(400).json({message: "User already exists"})
            }
            const heshPassword = await bcrypt.hash(password, 10)

            req.body.password = heshPassword

            const newUser = new User(req.body)
            await newUser.save()

            const token = JWT.sign({username, id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "12h"})

            res.status(201).json({message: "sign Up succesfully", newUser, token})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    //  login user
    loginUser: async (req, res) => {
        const {username, password} = req.body
        try {
            const user = await User.findOne({username})
            if(user){
                const validaty = await bcrypt.compare(password, user.password)

                if(validaty){
                    const token = JWT.sign({username, id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "12h"})
                    return res.status(200).json({message: "login succesfully", user, token})
                }
                return res.status(400).json({message: "wrong Password"})
            }
            return res.status(404).json({message: "user not found"})
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
} 

module.exports = authCtrl