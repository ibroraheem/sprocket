const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    username: {
        type: String,
        unique: true,
    },
    firstName: {
        type: String,
        capitalize: true
    },
    lastName: {
        type: String,
        capitalize: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    }
    
},
    { timestamps: true }
)

const User = mongoose.model('User', UserSchema);

module.exports = User;