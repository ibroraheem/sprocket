const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const isEmail = require('email-validator')
const nodemailer = require('nodemailer')

const register = async (req, res) => {
    const { email, firstName, lastName, password, } = req.body
    if (!email || !firstName || !lastName || !password) {
        return res.status(400).send({
            message: 'All fields are required'
        })
    }
    if (!isEmail.validate(email)) {
        return res.status(400).send({
            message: 'Please enter a valid email address'
        })
    } 
    const oldUser = await User.findOne({ email })
    if (oldUser) {
        return res.status(409).send({
            message: 'User already exist. Please login.'
        })
    }
    const otp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000).toString()
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        email: email.toLowerCase(),
        firstName,
        lastName,
        otp: otp,
        password: hashedPassword
    })
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    )
    res.status(201).send({
        message: 'User created successfully',
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        token
    })
}

const verifyOtp = async (req, res) => {
    const { otp } = req.body
    if (!otp) {
        return res.status(400).send({
            message: 'OTP is required'
        })
    }
    const user = await User.findOne({ otp: otp })
    if (!user) {
        return res.status(400).send({
            message: 'Invalid OTP'
        })
    }
    user.isVerified = true
    user.otp = null
    await user.save()
    res.status(200).send({
        message: 'User verified successfully',
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({
            message: 'All fields are required'
        })
    }
    if (!isEmail.validate(email)) {
        return res.status(400).send({
            message: 'Please enter a valid email address'
        })
    }
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        return res.status(400).send({
            message: 'Invalid Email'
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).send({
            message: 'Invalid Password'
        })
    }
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    )
    res.status(200).send({
        message: 'Login successful',
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        token
    })
}



module.exports = {register, login, verifyOtp}