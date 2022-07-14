const jwt = require('jsonwebtoken')

const auth = async(req, res, next)=>{
    const token = req.headers["authorization"]
    if(!token) return res.status(400).json('Not logged in')
    try {
        const {user} = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        res.status(500).json(error)
    }

}

module.exports = auth