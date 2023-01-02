const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const isEmail = require('email-validator')
const nodemailer = require('nodemailer')

const register = async (req, res) => {
    try {
        const { email, username, firstName, lastName, password, referredBy } = req.body
        if (!email || !username || !firstName || !lastName || !password) return res.status(400).send({ message: 'All fields are required' })
        if (!isEmail.validate(email)) return res.status(400).send({ message: 'Please enter a valid email address' })
        if (password.length < 6) return res.status(400).send({ message: 'Password must be at least 6 characters' })
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.findOne({ email: email.toLowerCase() })
        if (user) return res.status(400).send({ message: 'A user with this email already exists' })
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase()
        if (referredBy) {
            const referredUser = await User.findOne({ referralCode: referredBy })
            if (!referredUser) return res.status(400).send({ message: 'Invalid referral code' })
            const newUser = await User.create({
                email: email.toLowerCase(),
                username,
                firstName,
                lastName,
                password: hashedPassword,
                referredBy,
                referralCode
            })
            referredUser.referrals.push({
                avatar: newUser.avatar,
                username: newUser.username
            })
            referredUser.balance.referralBalance += 20
            referredUser.balance.totalBalance += 20
            await referredUser.save()
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5y' })
            res.status(201).send({
                message: 'Registration successful',
                email: newUser.email,
                referralCode: newUser.referralCode,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                id: newUser._id,
                referrals: newUser.referrals,
                balance: newUser.balance,
                token
            })
        } else {
            const newUser = await User.create({
                email: email.toLowerCase(),
                username,
                firstName,
                lastName,
                password: hashedPassword,
                referralCode
            })
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5y' })
            res.status(201).send({
                message: 'Registration successful',
                email: newUser.email,
                referralCode: newUser.referralCode,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                id: newUser._id,
                referrals: newUser.referrals,
                balance: newUser.balance,
                token
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}



const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.status(400).send({ message: 'All fields are required' })
        if (!isEmail.validate(email)) return res.status(400).send({ message: 'Please enter a valid email address' })
        const user = await User.findOne({ email: email.toLowerCase() })
        if (!user) return res.status(400).send({ message: 'Invalid credentials' })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).send({ message: 'Invalid credentials' })
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '5y' })
        res.status(200).send({
            message: 'Login successful',
            email: user.email,
            referralCode: user.referralCode,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user._id,
            referrals: user.referrals,
            balance: user.balance,
            token
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
}


module.exports = { register, login }