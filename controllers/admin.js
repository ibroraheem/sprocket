const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config()


const register = async (req, res) => {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const admin = await Admin.create({
            username,
            password: hashedPassword
        })
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(201).json({ message: "admin created", username: admin.username, token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const admin = await Admin.findOne({ username })
        if (!admin) return res.status(401).json({ message: "Invalid Username" })
        const isValid = await bcrypt.compare(password, admin.password)
        if (!isValid) return res.status(401).json({ message: "invalid Password" })
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(200).json({ message: "admin logged in", username: admin.username, token })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getUsers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const users = await User.find({})
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const user = await User.findOne({ _id: id })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTotalRegisteredUsers = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const users = await User.find({})
        res.status(200).json({ totalRegisteredUsers: users.length })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTotalRegisteredUsersToday = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const today = new Date()
        const users = await User.find({ createdAt: { $gte: today } })
        res.status(200).json({ totalRegisteredUsersToday: users.length })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getTotalMinedBalance = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const users = await User.find({})
        let totalMinedBalance = 0
        users.forEach(user => {
            totalMinedBalance += user.balance.totalBalance
        })
        res.status(200).json({ totalMinedBalance })
        
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { register, login, getUsers, getUser, getTotalRegisteredUsers, getTotalRegisteredUsersToday, getTotalMinedBalance }