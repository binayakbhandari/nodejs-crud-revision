require('dotenv').config()

const mongoose = require('mongoose')
const connectToDatabase = async () => {
    await mongoose.connect(process.env.CONNECTION_STRING)
    console.log("Connected to DB successfully")
}

module.exports = connectToDatabase