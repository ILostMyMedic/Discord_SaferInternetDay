const mongoose = require('../db/mongo')
const { Schema } = require('mongoose')

const guildSchema = new Schema({
    details: {
        guildID: { type: String, required: true },
        guildName: { type: String, required: true },
    },
    counts: {
        memberCount: { type: Number, required: true },
        botCount: { type: Number, required: true },
    },
    roles: [
        {
            id: { type: String },
            name: { type: String }
        }
    ],
})


const Guild = mongoose.model('Guilds', guildSchema)
module.exports = Guild