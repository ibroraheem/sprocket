const jwt = require('jsonwebtoken')
const User = require('../models/user')

const mine = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" });
         // date comparison
        const date = new Date(user.balance.miningTime).getFullYear() + '-' + new Date(user.balance.miningTime).getMonth() + '-' + new Date(user.balance.miningTime).getDate();
        const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
        if (user.balance.isMining && date !== today) {
            //Here I am adding the refferal earn also to the user, so is earning is determine base on his friends
            // referral length / 100 * 0.2 = team rate
            let referralsEarnCount = user.referrals.length / 100 * 0.2;
            let minedReward = 240 + referralsEarnCount;
            user.balance.isMining = false
            user.balance.minedBalance += minedReward;
            await user.save()
        }else if (!user.balance.isMining) {
            user.balance.isMining = true;
            user.balance.miningTime = Date.now();
            await user.save();
        }
        res.status(200).send({ message: 'mined' });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const stopMining = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" });

        // date comparison
        const date = new Date(user.balance.miningTime).getFullYear() + '-' + new Date(user.balance.miningTime).getMonth() + '-' + new Date(user.balance.miningTime).getDate();
        const today = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
        if (user.balance.isMining && date !== today) {
            //Here I am adding the refferal earn also to the user, so is earning is determine base on his friends
            // referral length / 100 * 0.2 = team rate
            let referralsEarnCount = user.referrals.length / 100 * 0.2;
            let minedReward = 240 + referralsEarnCount;
            user.balance.isMining = false
            user.balance.minedBalance += minedReward;
            await user.save()
        }
        res.status(200).send({ message: 'mining stoped' });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const balance = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" })
        res.status(200).send({
            message: "Balance retrieved successfully",
            balance: user.balance
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

module.exports = { mine, stopMining, balance }
