// sender, content, chat
const mongoose = require('mongoose')
const Message = require('./Message')

const chatSchema = new mongoose.Schema({
    isGroup: {
        type: Boolean,
        default: false
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    chatName: {
        type: String,
        required: true
    },
    users: [
        {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {timestamps: true})


const Chat = mongoose.model('Chat', chatSchema)

chatSchema.pre('deleteOne', function(next) {
    const chatId = this.getQuery()['_id'];
    // this.model('Message').deleteOne({ chat: chatId }, next);
    Message.deleteMany({ chat: chatId }, next);
});

module.exports = Chat