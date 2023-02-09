const { CommandInteraction, EmbedBuilder } = require("discord.js");
const { NoFiltrButton } = require("../../middleware/NoFiltr.game");
const quizSchema = require("../../models/quiz.model");
const guildSchema = require("../../models/guild.model");
const { roles } = require("../../middleware/roles.middleware");

module.exports = {
	name: "interactionCreate",
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction, client) {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) {
				return interaction.reply({
					content: "This command is outdated",
					ephemeral: true,
				});
			}

			command.execute(interaction, client);
		}

		else if(interaction.isButton()) {
			if(interaction.customId !== 'ClaimRole') return NoFiltrButton(interaction);

			if(interaction.customId === 'ClaimRole') {
				const quiz = await quizSchema.findOne({ guild: interaction.guild.id, member: interaction.user.id });
				const guild = await guildSchema.findOne({ "details.guildID": interaction.guild.id });
				if(!quiz) return interaction.reply({ content: 'You have not taken the quiz yet', ephemeral: true });
				if(!guild) return interaction.reply({ content: 'This server has not set up the bot yet', ephemeral: true });
				
				// find the role in guild under roles array object where name = quiz.outcome
				const role = guild.roles.find(role => role.name === quiz.outcome);

				// check if role exists in Server
				if(interaction.guild.roles.cache.has(role.id)) {
					interaction.member.roles.add(role.id);

					const embed = new EmbedBuilder()
						.setTitle('Thank you!')
						.setDescription(`Thank you for participating in the #SaferInternetDay! You have been given the role <@&${role.id}> as a reward for taking the quiz!`)
						.setColor(roles.find(role => role.name === quiz.outcome).color)
					interaction.reply({ embeds: [embed], ephemeral: true });

					// if member has a different role from guild.roles, remove it
					const memberRoles = interaction.member.roles.cache.filter(role => role.id !== interaction.guild.roles.everyone.id);
					memberRoles.forEach(role => {
						if(guild.roles.find(role => role.name === quiz.outcome)) {
							interaction.member.roles.remove(role.id);
						}
					});

				} else {
					return interaction.reply({ content: `The role ${role.name} does not exist on this server`, ephemeral: true });
				}
				

			}
		}
	},
};
