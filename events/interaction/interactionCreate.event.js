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
				const filteredRoles = guild.roles.filter(role => role.name !== quiz.outcome);

				// check if role exists in Server
				if(interaction.guild.roles.cache.has(role.id)) {
					let embed;
					
					const error = new EmbedBuilder()
						.setTitle('Error')
						.setDescription(`There was an error adding the role to you. Please contact the server owner to inform them that the role <@&${role.id}> was not correctly added to you.`)
						.setColor(0xff0000)
					
					const success = new EmbedBuilder()
						.setTitle('Thank you!')
						.setDescription(`Thank you for participating in the #SaferInternetDay! You have been given the role <@&${role.id}> as a reward for taking the quiz!`)
						.setColor(roles.find(role => role.name === quiz.outcome).color)						
					
					
						embed = success;

						// add role
						interaction.member.roles.add(role.id);
						// remove all roles from filteredRoles from member
						filteredRoles.forEach(role => {
							interaction.member.roles.remove(role.id);
						});
						
						interaction.reply({ embeds: [embed], ephemeral: true });
					
				} else {
					return interaction.reply({ content: `The role ${role.name} does not exist on this server`, ephemeral: true });
				}
				

			}
		}
	},
};
