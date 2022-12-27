const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', true)
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log("MongoDB Connected")
}

module.exports = connectDB;