const User = require('../model/User')
const jwt = require('jsonwebtoken')

module.exports = {
    register: async (req, res) => {
        const { username, password, email, picture } = req.body
        if (!username || !password || !email) return res.status(400).json('Fields cannot be empty')
        const userExists = await User.findOne({ $or: [{ email }, { username }] })
        if (userExists) return res.status(400).json('User already exist')
        const user = await new User({ ...req.body }).save()
        return res.status(200).json(user)
    },
    login: async (req, res) => {
        const { email, password } = req.body
        if (!password || !email) return res.status(400).json('Fields cannot be empty')
        const existUser = await User.findOne({ email })
        if (!existUser) return res.status(400).json('User is not found')
        const isMatch = await existUser.checkPassword(password)
        if (!isMatch) return res.status(200).json('Credential incorrect')
        const token = jwt.sign({ user: existUser }, process.env.JWT_SECRET, {expiresIn: '2d'})
        // res.cookie('secretToken', token, {
        //     maxAge: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        //     httpOnly: true,
        //     path: '/',
        //     sameSite: 'none'
        // })
        return res.status(200).json({token})
    },
    getUsers: async (req, res) => {
        const { search } = req.query
        const keyword = req.query.search ? { $or: [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] } : {}
        const users = await User.find(keyword)
            .find({ _id: { $ne: req.user._id } })

        res.status(200).json(users)
    },
    getUser: async (req, res) => {
        return res.status(200).json(req.user)
    },
    logout: async (req, res) => {
        const key = req.cookies['secretToken']
        if (!key) return res.status(200).json('Please Login')
        res.clearCookie('secretToken')
        return res.status(200).json('Logged out')
    }
}