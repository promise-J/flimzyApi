// sender, content, chat
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
