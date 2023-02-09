const {
    SlashCommandBuilder,
    CommandInteraction,
    PermissionFlagsBits,
    Client
} = require("discord.js");
const {NoFiltrGame} = require("../../middleware/NoFiltr.game");
const {createRoles} = require("../../middleware/roles.middleware");
const memberSchema = require("../../models/member.model");
const quizSchema = require("../../models/quiz.model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nofiltr")
        .setDescription("Participate in the Discord x NoFiltr SaferInternetDay quiz!"),
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        const quiz = await quizSchema.findOne({ guild: interaction.guild.id, member: interaction.user.id });

        // 1h cooldown
        if(quiz && quiz.time && quiz.time > Date.now() - 3600000) {
            // convert Date.now() to timestamp and add 1h
            const timestamp = Math.floor((new Date(quiz.time).getTime() + 3600000) / 1000);
            return interaction.reply({
                content: `You have already participated in the quiz! Please wait <t:${timestamp}:R> minutes before trying again.`,
                ephemeral: true
            });
        }

        await memberSchema.findOneAndUpdate(
            { memberID: interaction.user.id },
            { username: interaction.user.username },
            { upsert: true, new: true }
        );

        createRoles(interaction.guild);
        
        NoFiltrGame(interaction);
    },
};
