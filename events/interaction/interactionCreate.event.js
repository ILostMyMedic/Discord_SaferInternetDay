const { CommandInteraction } = require("discord.js");
const { NoFiltrButton } = require("../../middleware/NoFiltr.game");

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
			NoFiltrButton(interaction);
		}
	},
};
