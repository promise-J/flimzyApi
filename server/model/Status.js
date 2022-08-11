// sender, content, Status
const mongoose = require('mongoose')
const Message = require('./Message')

const StatusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    statusText: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    expiresAt: {
        type: String,
    }
}, {timestamps: true})


const Status = mongoose.model('Status', StatusSchema)


module.exports = Status