require('dotenv').config()
const { ActivityType } = require("discord.js");
const chalk = require("chalk");
const { loadCommands } = require("../../handlers/commands.handler");


module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        // after flushing all commands, load all commands
        const [loadCommandsClient] = await Promise.all([
            loadCommands(client, chalk)
        ]);
    },
};