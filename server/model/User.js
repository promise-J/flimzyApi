const bcrypt = require('bcrypt')
// sender, content, chat
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    picture: {
        type: String,
        default: 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
    },
    gender: {
        type: String
    },
    about: {
        type: String
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    request: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notifications: [{
        type: String
    }]
}, {timestamps: true})

userSchema.pre('save', async function save(next){
    if(!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(this.password, salt)
    this.password = password
    return next()
})

userSchema.methods.checkPassword = async function(password){
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User