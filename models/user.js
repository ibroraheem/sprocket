const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    firstName: {
        type: String,
        required: true,
        capitalize: true
    },
    lastName: {
        type: String,
        required: true,
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