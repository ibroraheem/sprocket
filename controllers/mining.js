const jwt = require('jsonwebtoken')
const User = require('../models/user')

const mine = async (req, res) => {
    try {
        const token = req.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" })
        user.balance.isMining = true
        user.balance.miningTime = Date.now()
        await user.save()
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const stopMining = async (req, res) => {
    try {
        const token = req.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" })
        user.balance.isMining = false
        user.balance.minedBalance += 240
        await user.save()
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

module.exports = { mine, stopMining }