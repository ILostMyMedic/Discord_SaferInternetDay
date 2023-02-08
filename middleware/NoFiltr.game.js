// import button
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

const questions = require('../config/NoFiltr.questions.json');
const outcome = require('../config/NoFiltr.outcomes.json');
const NoFilterLogic = require('./NoFiltr.logic');


const games = new Map();
/**
 * guildId: {
 *  users: {
 *     userId: {
 *        answers: [],
 *        channel: channel,
 *     }
 * }
 */

const initGame = (guildID) => {
    if (!games.has(guildID)) {
        console.log(chalk.green(`[NoFiltr] Game initialized for guild ${guildID}`));
        games.set(guildID, {
            users: new Map(),
        });
    }
}

const renderQuestion = (guildID, userID) => {
    if(!games.has(guildID)) return;
    
    // add user to game
    if(!games.get(guildID).users.has(userID)) {
        games.get(guildID).users.set(userID, {
            answers: [],
            channel: null,
            interaction: null
        });
    }

    // depending on the length of answers, render the question from questions.json
    const answers = games.get(guildID).users.get(userID).answers;

    // get current question
    const currentQuestion = questions[answers.length];

    // get current options
    const currentOptions = currentQuestion.a;

    // convert index to letter, 1 -> A, 2 -> B, 3 -> C, 4 -> D
    const indexToLetter = (index) => {
        return String.fromCharCode(65 + index);
    }

    // render buttons
    const buttons = currentOptions.map((option, index) => {
        return new ButtonBuilder()
            .setStyle('Secondary')
            .setLabel(indexToLetter(index))
            .setCustomId(indexToLetter(index));
    });

    // // render action row
    const actionRow = new ActionRowBuilder()
        .addComponents(buttons);

    const content = new EmbedBuilder()
        .setDescription(
            currentQuestion.q + '\n\n' +
            currentOptions.map((option, index) => {
                return `${indexToLetter(index)}: ${option}`;
            }).join('\n')
        );

    return {
        embeds: [content],
        components: [actionRow],
        ephemeral: true
    }
}

const NoFiltrGame = (interaction) => {
    // init game
    initGame(interaction.guildId);

    // render question
    const content = renderQuestion(interaction.guildId, interaction.user.id);
    // send message
    const message = interaction.reply(content);
    
    // save message to users interaction in order to update it later
    games.get(interaction.guildId).users.get(interaction.user.id).interaction = message;
}


const NoFiltrButton = (interaction) => {
    const userID = interaction.user.id;
    const buttonID = interaction.customId;
    const guildID = interaction.guildId;

    // if no game for guild or user found return
    if(!games.has(guildID) || !games.get(guildID).users.has(userID)) return;

    // add answer to user
    games.get(guildID).users.get(userID).answers.push(buttonID);
    const message = games.get(guildID).users.get(userID).interaction;
    
    // if user has answered all questions
    if(games.get(guildID).users.get(userID).answers.length === questions.length) {
        try {
            // get all answers as array and pass them to NoFilterLogic
            const answers = games.get(guildID).users.get(userID).answers;
            const result = NoFilterLogic(answers);

            const letterToIndex = (letter) => {
                return letter.charCodeAt(0) - 65;
            }

            // get outcome reverse result from letter to number
            const outcomeResult = outcome[letterToIndex(result)];

            // render outcome
            const content = new EmbedBuilder()
                .setDescription(
                    `**${outcomeResult.name}** \n\n ${outcomeResult.description}`
                );
            interaction.update({embeds: [content], components: [], ephemeral: true});
            // remove user from game
            games.get(guildID).users.delete(userID);
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            interaction.update(renderQuestion(guildID, userID));
        } catch (error) {
            console.log(error);
        }
    }
}


module.exports = {
    NoFiltrGame,
    NoFiltrButton
};