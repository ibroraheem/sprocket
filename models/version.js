const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    version: {
        type: String,
        required: true
    },


},
    { timestamps: true }
)

const Version = mongoose.model('Version', versionSchema)

module.exports = Version