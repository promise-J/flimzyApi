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
    },
    typeOf: {
      type: String,
      enum: ['request', 'response', 'missed', 'unmissed']
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
