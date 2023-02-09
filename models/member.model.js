const mongoose = require('../db/mongo')
const { Schema } = require('mongoose')

const memberSchema = new Schema({
    username: { type: String, required: true},
    memberID: { type: String, required: true},
})


const Member = mongoose.model('Members', memberSchema)
module.exports = Member