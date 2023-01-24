const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    viewers: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
)

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
