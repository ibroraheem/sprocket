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
    },
    referralCode: {
        type: String,
        default: null
    },
    referrals: [{
        avatar: {
            type: String,
        },
        username: {
            type: String,
        },
        isVerified: {
            type: Boolean,
        },
    }],
    avatar: {
        type: String,
        default: null
    },
    referredBy: {
        type: String,
        default: null
    },
    balance: {
        minedBalance: {
            type: Number,
            default: 0.0
        },
        referralBalance: {
            type: Number,
            default: 0.0
        },
        totalBalance: {
            type: Number,
            default: 0.0
        },
        isMining: {
            type: Boolean,
            default: false
        },
        miningTime: {
            type: Date,
            default: null
        },
    },
    mspoc: {
        balance: {
            type: Number,
            default: 0.0,
        },
        histories: {
            type: Array,
            default: [],
        },
        grease: {
            greaseXs: {
                type: Number,
            },
            expireDate: {
                type: String,
            }
        }
    }
},
    { timestamps: true }
)

const User = mongoose.model('User', UserSchema);

module.exports = User;
