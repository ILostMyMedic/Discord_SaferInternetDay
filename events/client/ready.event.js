require('dotenv').config()
const { ActivityType } = require("discord.js");
const chalk = require("chalk");
const { loadCommands } = require("../../handlers/commands.handler");
const guildSchema = require("../../models/guild.model");
const { createRoles } = require("../../middleware/roles.middleware");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.guilds.cache.forEach(async guild => {
            const exists = await guildSchema.findOne({ 'details.guildID': guild.id });
            if (!exists) {
                const register = guildSchema.create({
                    details: {
                        guildID: guild.id,
                        guildName: guild.name,
                    },
                    counts: {
                        memberCount: guild.memberCount - guild.members.cache.filter(member => member.user.bot).size,
                        botCount: guild.members.cache.filter(member => member.user.bot).size,
                    },
                })
            }
        });

        // after flushing all commands, load all commands
        const [loadCommandsClient] = await Promise.all([
            loadCommands(client, chalk)
        ]);
    },
};