const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
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
