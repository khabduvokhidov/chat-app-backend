const Message = require("../models/messageModel")

const messageCtrl = {
    //create message
    addMessage: async(req, res) => {
        try {
            const {chatId, senderId, text} = req.body
            
            const message = new Message({chatId, senderId, text})

            await message.save()

            res.status(201).json(message)

        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

        // get Message 
        getMessages: async(req, res) => {
        try {
            const {chatId} = req.params
            
            const message = await Message.find({chatId})

            res.status(200).json(message)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

    // Delete messages
    deleteMessage: async(req, res) => {
        const {messageId} = req.params
        const {userId} = req.body
        try {
            if(userId){
                await Message.findByIdAndDelete(messageId)
                res.status(200).json("message delete succssfely")
            }else{
                res.status(403).json("Access Deind! You can delete only your own Account.")
            }
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = messageCtrl