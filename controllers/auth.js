const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const isEmail = require('email-validator')
const nodemailer = require('nodemailer')

const register = async (req, res) => {
    const { email, password, } = req.body
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
    const oldUser = await User.findOne({ email:email.toLowerCase() })
    if (oldUser) {
        return res.status(409).send({
        message: 'User already exist. Please login.'
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword
    })
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '5y' }
    )
    res.status(201).send({
        message: 'User created successfully',
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user._id,
        token
    })
}

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, username } = req.body
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded.userId })
        if (!user) return res.status(404).send({ message: 'User not found' })
        if (firstName) user.firstName = firstName
        if (lastName) user.lastName = lastName
        if (username) user.username = username
        await user.save()
        res.status(200).send({
            message: 'User updated successfully',
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user._id
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
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
        { expiresIn: '5y' }
    )
    res.status(200).send({
        message: 'Login successful',
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user._id,
        token
    })
}



module.exports = {register, login}