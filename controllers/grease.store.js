const jwt = require('jsonwebtoken')
const User = require('../models/user')

const date = new Date();
const purchase = async (req, res) => {
    const { amount, greaseXs } = req.body;
    const expireDate = date.setDate(date.getDate() + 7);
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" });
        if (user.mspoc.balance < amount) return res.status(403).send({ message: "Insufficient balance." });
        if (user.mspoc.grease.expireDate != null && user.mspoc.grease.expireDate > date.getTime()) return res.status(403).send({ message: "Cannot purchase any grease at the moment." });
        user.mspoc.grease.greaseXs = greaseXs;
        user.mspoc.grease.expireDate = expireDate;
        user.mspoc.balance -= amount;
        user.mspoc.histories.splice(0, 0, { content: `You Purchase grease x${greaseXs} booster at rate of ${amount}. Your new balance is ${user.mspoc.balance}`, date });
        await user.save();
        res.status(200).json({ message: "Grease " + greaseXs, mspoc: user.mspoc });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
const getMspocInfo = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" });
        res.status(200).json({ mspoc: user.mspoc });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
const claimMspoc = async (req, res) => {
    try {
        const { earned } = req.body;
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" });
        user.mspoc.balance += earned;
        user.mspoc.histories.splice(0, 0, { content: `You earned ${earned}mspoc by watching ADs. Your new balance is ${user.mspoc.balance}`, date });

        await user.save();
        res.status(200).json({ mspoc: user.mspoc });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = { purchase, getMspocInfo, claimMspoc };