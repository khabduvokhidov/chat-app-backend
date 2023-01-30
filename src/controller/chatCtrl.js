const Chat = require("../models/chatModel")

const chatCtrl = {
    // create a chat 
    createChat: async (req, res) => {
        try {
          const {senderId, receviedId} = req.body
    
          const newChat = new Chat({members: [senderId,  receviedId]})
          await newChat.save()
          res.status(201).json(newChat)
        } catch (error) {
          res.status(500).json({message: error.message})
        }
    },
 
    // chat list
    userChats: async(req, res) => { // user yozishgan insonlar
        try {
            const {userId} = req.body
            const chats = await Chat.find({membars: {$in: [userId]}})
            res.status(200).json(chats)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    // find chat 
    findChat: async(req, res) => {  // bir dona chat qidruv joyi
        try {
            const {fristId, secoundId} = req.params
            const chat = await Chat.find({members: {$all: [fristId, secoundId]}})

            res.status(200).json(chat)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    chatDelete: async(req, res) => {
        const {id} = req.params
        const {userId} = req.body
        try {
            if(userId){
                await Chat.findByIdAndDelete(id)
                res.status(200).json("user delete succssfely")
            }else{
                res.status(403).json("Access Deind! You can delete only your own Account.")
            }

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = chatCtrl