const {
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits,
    Client
} = require("discord.js");
const {NoFiltrGame} = require("../../middleware/NoFiltr.game");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nofiltr")
        .setDescription("Participate in the Discord x NoFiltr SaferInternetDay quiz!"),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    execute(interaction, client) {
        NoFiltrGame(interaction);
    },
};
