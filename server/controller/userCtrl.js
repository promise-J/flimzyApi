const User = require('../model/User')
const jwt = require('jsonwebtoken')

module.exports = {
    register: async (req, res) => {
        const { username, password, email, picture } = req.body
        if (!username || !password || !email) return res.status(400).json('Fields cannot be empty')
        const userExists = await User.findOne({email})
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
        // res.cookie('secret', token)
        res.cookie('secret', token)
        return res.status(200).json({token})
    },
    updateUser: async(req, res)=>{
        try {
            const newUser = await User.findByIdAndUpdate(req.user._id, {
                $set: req.body
            }, {new: true})
            return res.status(200).json(newUser)
        } catch (error) {
            return res.status(500).json(error)
        }
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
    },
    sendFriendRequest: async(req, res)=>{
        try{
            let result = await User.findByIdAndUpdate(req.params.userId, {
                $addToSet: {request: req.user._id}
            },{new: true})
           
            return res.status(200).json({request: req.user._id})
        }catch(error){
            return res.status(500).json(error)
        }
    },
    getFriendRequest: async(req, res)=>{
        try {
            const user = await User.findById(req.user._id)
            const result = await User.find({_id: {$in: user.request}})
            return res.status(200).json(result)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error)
        }
    },
    removeFriendRequest: async(req, res)=>{
        try{
            const result = await User.findByIdAndUpdate(req.user._id,{
                $pull: {request: req.params.userId}
            },{new: true})
            return res.status(200).json('Request Rejected')
        }catch(error){
            return res.status(500).json(error)
        }
    }
}