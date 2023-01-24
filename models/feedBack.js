const mongoose = require('mongoose');

const feedBackSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
},
    { timestamps: true }
)

const FeedBack = mongoose.model('FeedBack', feedBackSchema)

module.exports = FeedBack