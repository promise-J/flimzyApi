const Message = require("../model/Message")
const Chat = require("../model/Chat")
const User = require("../model/User")

const messageCtrl = {
    createMessage: async(req, res)=>{
        const {content, chat, replyMessage} = req.body
        try {
            if(!chat || !content) return res.status(400).json('Fields must not be empty')
            let newMessage = new Message({
                content,
                chat,
                sender: req.user._id,
                replyMessage
            })
            await newMessage.save()
            newMessage = await newMessage.populate('sender', 'name picture')
            newMessage = await newMessage.populate('chat')
            newMessage = await newMessage.populate({
                path: 'replyMessage',
                populate: {path: 'sender'}
            })
            newMessage = await User.populate(newMessage, {
                path: "chat.users",
                select: "name picture email"
            })

            await Chat.findByIdAndUpdate(chat, {
                latestMessage: newMessage,
            }).populate('latestMessage', 'content')
            return res.status(200).json(newMessage)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }

    },
    fetchChats: async(req, res)=>{
        const {chatId} = req.params
        try {
            const chats = await Message.find({chat: chatId})
            .populate('chat')
            .populate('sender')
            .populate({
                path: 'replyMessage',
                populate: {
                    path: 'sender'
                }
            })
            return res.status(200).json(chats)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    deleteMessage: async(req, res)=>{
        try {
            const {messages, message} = req.body
            let result
            if(!message){
                result = await Message.deleteMany({_id: {$in: messages}})
            }else{
                result = await Message.findByIdAndDelete(message)
            }
            return res.status(200).json(result)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    editMessage: async(req, res)=>{
        try {
            const message = await Message.findByIdAndUpdate(req.params.id, {
                $set: req.body
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = messageCtrl