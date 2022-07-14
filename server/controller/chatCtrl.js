const Chat = require('../model/Chat')
const User = require('../model/User')

module.exports = {
    accessChat: async (req, res) => {
        const chatSender = req.query.chatSender
        let chatExist = await Chat.find({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { $eq: req.params.userId } } },
                { users: { $elemMatch: { $eq: req.user._id } } },
            ]
        }).populate('users', "-password").populate('latestMessage')

        chatExist = await User.populate(chatExist, {
            'path': "latestMessage.sender",
            "select": "picture username email"
        })

        if (chatExist.length > 0) {
            return res.status(400).json('Chat already exist')
        } else {
            // create a new Chat. 
            const newChat = new Chat({
                chatName: chatSender,
                isGroup: false,
                users: [req.user._id, req.params.userId]
            })

            try {
                const createdChat = await Chat.create(newChat)
                const chat = await Chat.findById(createdChat._id)
                    .populate('users', "-password")
                    .populate("latestMessage")
                return res.status(200).json(chat)
            } catch (error) {
                return res.status(500).json(error)
            }

        }
    },
    getSingleChat: async(req, res)=>{
        try {
            const chat = await Chat.findOne({_id: req.params.chatId}).populate('users', '-password').populate('latestMessage')
            return res.status(200).json(chat)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    userChats: async (req, res) => {
        try {
            const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
                .populate('users', '-password')
                .populate('latestMessage')
                .populate('groupAdmin')
                .sort({ updatedAt: -1 })
            return res.status(200).json(chats)
        } catch (error) {
            return res.status(500).json(error)
        }

    },
    createGroup: async (req, res) => {
        let { name, users } = req.body
        if (!name || !users) return res.status(400).json('Field must not be empty')
        if (users.length < 2) return res.status(400).json('At least three users must be in a group')
        users.push(req.user._id)
        const newGroup = await Chat.create({
            isGroup: true,
            groupAdmin: req.user._id,
            users,
            chatName: name
        })
        return res.status(200).json(newGroup)
    },
    renameGroup: async (req, res) => {
        const { chatId } = req.params
        try {
            const updatedChat = await Chat.findByIdAndUpdate(chatId, {
                chatName: req.body.chatName
            }, { new: true })
            if (!updatedChat) return res.status(400).json('Chat is not found')
            return res.status(200).json(updatedChat)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    addToGroup: async(req, res)=>{
        const {userId} = req.body
        try {
            const updatedGroup = await Chat.findByIdAndUpdate(req.params.chatId, {
                $push: {users: userId}
            },{new: true})
            if(!updatedGroup) return res.status(400).json('Group not found')
            return res.status(200).json(updatedGroup)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    removeFromGroup: async(req, res)=>{
        const {userId} = req.body
        try {
            const updatedGroup = await Chat.findByIdAndUpdate(req.params.chatId, {
                $pull: {users: userId}
            },{new: true})
            if(!updatedGroup) return res.status(400).json('Group not found')
            return res.status(200).json(updatedGroup)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    removeGroup: async(req, res)=>{
        const {chatId} = req.params
        try {
            const deletedChat = await Chat.findByIdAndDelete(chatId)
            return res.status(200).json(deletedChat)
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    deleteChat: async(req, res)=>{
        try {
            await Chat.findOneAndDelete({_id: req.params.chatId})
            return res.status(200).json('Chat Deleted')
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}