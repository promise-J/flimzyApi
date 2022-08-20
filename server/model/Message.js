// sender, content, chat
const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    replyMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    img: {
        type: String
    },
    imgPrev: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    audio: {
        type: String
    }
}, {timestamps: true})


const Message = mongoose.model('Message', messageSchema)

module.exports = Message