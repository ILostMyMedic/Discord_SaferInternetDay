const mongoose = require('../db/mongo')
const { Schema } = require('mongoose')

const quizSchema = new Schema({
    guild: {
        type: String,
        required: true
    },
    member: {
        type: String,
        required: true
    },
    outcome: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})


const Quiz = mongoose.model('SaferInternetDay', quizSchema)
module.exports = Quiz