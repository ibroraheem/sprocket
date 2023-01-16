const jwt = require('jsonwebtoken')
const User = require('../models/user')

const mine = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" })
       if(!user.balance.isMining){
        user.balance.isMining = true;
        user.balance.miningTime = Date.now();
        await user.save();
       }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const stopMining = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" })
         if(user.balance.isMining){
        user.balance.isMining = false
        user.balance.minedBalance += 240
        await user.save()
       }
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