const Notification = require("../model/Notification");

module.exports = {
  createNotification: async(req, res)=>{
    try {
        const {content, userId} = req.body
        const notif = await Notification.create(req.body)
        return res.status(200).json(notif)
    } catch (error) {
        return res.status(500).json(error)
    }
  }
};
