const jwt = require('jsonwebtoken')
const Notification = require('../models/notification')
const FeedBack = require('../models/feedBack')
const Admin = require('../models/admin')
const User = require('../models/user')

const newNotification = async (req, res) => {
    try {
        const { title, content } = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const notification = await Notification.create({ title, content })
        res.status(200).json(notification)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getNotifications = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(401).json({ message: "Unauthorized" })
        const notifications = await Notification.find({})
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const updateNotification = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).send({ message: "User not found!" })
        if (!token) return res.status(401).json({ message: "Unauthorized" })
        const notification = await Notification({ _id: id })
        notification.viewers.push(user.username);
        await notification.save();
        res.status(200).json({ message: 'user viewer' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const notification = await Notification.findOneAndDelete({ _id: id })
        res.status(200).json({ message: "Notification deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const newFeedBack = async (req, res) => {
    try {
        const { title, content } = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.id })
        if (!user) return res.status(401).json({ message: "Unauthorized" })
        const feedback = await FeedBack.create({ title, content })
        res.status(200).json(feedback)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getFeedBacks = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const feedbacks = await FeedBack.find({})
        res.status(200).json(feedbacks)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getFeedBack = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const feedback = await FeedBack.findOne({ _id: id })
        res.status(200).json(feedback)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteFeedBack = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded.id })
        if (!admin) return res.status(401).json({ message: "Unauthorized" })
        const feedback = await FeedBack.findOneAndDelete({ _id: id })
        res.status(200).json({ message: "Feedback deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { newNotification, getNotifications, updateNotification, deleteNotification, newFeedBack, getFeedBacks, getFeedBack, deleteFeedBack }