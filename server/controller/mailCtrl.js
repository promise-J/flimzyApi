const sendMail = require("../utils/sendMail")

const mailCtrl = {
    messageMail: async(req, res)=>{
        try {
            const {options} = req.body
            await sendMail(req.body)
            res.status(200).json('Email sent')
        } catch (error) {
            return re.status(500).json(error)
        }
    }
}

module.exports = mailCtrl