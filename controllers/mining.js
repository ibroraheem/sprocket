const jwt = require('jsonwebtoken')
const User = require('../models/user')

// daily earn per user (will be halved in future)
let dailyEarn = 24;

const mine = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" });
        if (!user.balance.isMining) {
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
            //Here I am adding the referral earn also to the user, so is earning is determine base on his friends
            // referral length / 100 * 0.2 = team rate
            let referralsEarnCount = user.referrals.length / 100 * 0.2;
            let minedReward = dailyEarn + referralsEarnCount;
            console.log({ minedReward });
            if (user.mspoc.grease.expireDate != null && user.mspoc.grease.expireDate > new Date().getTime()) {
                minedReward = (dailyEarn + referralsEarnCount) * user.mspoc.grease.greaseXs;
                console.log({ minedReward });
            }
            user.balance.isMining = false
            user.balance.minedBalance += minedReward;
            await user.save()
        }
        res.status(200).send({ message: 'mining stopped' });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const balance = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" });
        let referralBonus = user.referrals.length / 100 * 0.2; // referral bonus formula total friends / 100 * 0.2
        dailyEarn += referralBonus;
        let basicRate = dailyEarn / 3600; // earn per sec in an hour
        let totalRate = dailyEarn / 24; // earn per hour
        if (user.mspoc.grease.greaseXs !== null) {
            dailyEarn += referralBonus * user.mspoc.grease.greaseXs
            basicRate = dailyEarn / 3600 * user.mspoc.grease.greaseXs; // earn per sec in an hour
            totalRate = dailyEarn / 24 * user.mspoc.grease.greaseXs != null ? user.mspoc.grease.greaseXs : 1; // earn per hour

        }
        // let basicRate = Number(dailyEarn / 86400).toFixed(4); // earn per sec in 24 hour
        res.status(200).send({
            message: "Balance retrieved successfully",
            balance: user.balance,
            referralBonus,
            dailyEarn,
            basicRate,
            totalRate,
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

module.exports = { mine, stopMining, balance }
