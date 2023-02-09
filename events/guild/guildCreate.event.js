const guildSchema = require("../../models/guild.model");

module.exports = {
	name: "guildCreate",
    on: true,
	async execute(guild) {
		
        // if the guild is not in the database, add it
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
	},
};
