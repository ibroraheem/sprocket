const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const isEmail = require('email-validator')
const referralCodes = require('referral-codes')
const Cloudinary = require('../config/cloudinary')
const nodemailer = require('nodemailer')

const register = async (req, res) => {
    try {
        const { email, username, password, firstName, lastName, referredBy, avatar } = req.body
        console.log({ email, username, password, firstName, lastName, referredBy, avatar });
        //         const avatar = req.file.path
        if (!email || !username || !password || !avatar) return res.status(400).send({ message: "Please fill all fields" })
        if (!isEmail.validate(email)) return res.status(400).send({ message: "Please enter a valid email" })
        if (password.length < 6) return res.status(400).send({ message: "Password must be at least 6 characters" })
        const hashedPassword = await bcrypt.hash(password, 10)
        const referralCode = referralCodes.generate({
            length: 8,
            count: 1,
            charset: referralCodes.charset('alphanumeric')
        })
        const user = await User.findOne({ email: email.toLowerCase() })
        if (user) return res.status(400).send({ message: "User with Email already exists. Login" })
        const _username = await User.findOne({ username: username.toLowerCase() })
        if (_username) return res.status(400).send({ message: "Username already taken" })
        if (referredBy) {
            const referred = await User.findOne({ referralCode: referredBy })
            if (!referred) return res.status(400).send({ message: "Invalid referral code" })
            const newUser = await User.create({
                email: email.toLowerCase(), username: username.toLowerCase(), password: hashedPassword, firstName, lastName, referredBy, referralCode: referralCode[0], avatar, balance: {
                    minedBalance: 1
                },
            });
            referred.referrals.push({ avatar: newUser.avatar, username: newUser.username, isVerified: newUser.isVerified });
            referred.balance.referralBalance += 10
            referred.balance.totalBalance += 20
            await referred.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1500d' })
            res.status(201).send({
                message: "User created successfully",
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                referrals: newUser.referrals,
                username: newUser.username,
                avatar: newUser.avatar,
                referredBy: referred.firstName,
                referralCode: newUser.referralCode,
                balance: newUser.balance,
                token
            })
        } else {
            const newUser = await User.create({ email: email.toLowerCase(), username: username.toLowerCase(), password: hashedPassword, firstName, lastName, referralCode: referralCode[0], avatar })
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1500d' })
            res.status(201).send({
                message: "User created successfully",
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                referrals: newUser.referrals,
                username: newUser.username,
                referralCode: newUser.referralCode,
                avatar: newUser.avatar,
                balance: newUser.balance,
                token
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return res.status(401).send({ message: "All fields must be filled in!" })
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.status(401).send({ message: "User not found!" })
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return res.status(401).json({ message: "invalid Password" })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1500d' })
        res.status(200).send({
            message: "Login successful",
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            referrals: user.referrals,
            referralCode: user.referralCode,
            balance: user.balance,
            avatar: user.avatar,
            token,
        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.status(401).send({ message: "Unauthorized" })
        const user = await User.findOne({ _id: decoded.id })
        if (!user) return res.status(401).send({ message: "Unauthorized" })
        user.balance.isMining = false
        user.balance.minedBalance += 0
        user.balance.totalBalance += 0
        await user.save()
        res.status(200).send({ message: "Logout successful" })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

const userInfo = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) return res.status(401).send({ message: "Unauthorized" })
        const user = await User.findOne({ _id: decoded.id })
        if (!user) return res.status(401).send({ message: "Unauthorized" });
        res.status(200).send(user.referrals)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

module.exports = { register, login, logout, userInfo }
