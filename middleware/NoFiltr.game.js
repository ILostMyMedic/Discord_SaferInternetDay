// import button
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const chalk = require('chalk');

const questions = require('../config/NoFiltr.questions.json');
const outcome = require('../config/NoFiltr.outcomes.json');
const NoFilterLogic = require('./NoFiltr.logic');

const quizSchema = require('../models/quiz.model');

const Guardian = './assets/Guardian.png';
const Healer = './assets/Healer.png';
const Invisible = './assets/Invisible.png';
const Mentor = './assets/Mentor.png';



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
            `**${currentQuestion.q}** \n\n
            ${currentOptions.map((option, index) => {
                return `**${indexToLetter(index)}:** ${option}`;
            }).join('\n\n')}`
        )
        .setColor('#404eed');

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


const NoFiltrButton = async (interaction) => {
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

            let thumbnail = null;
            switch(outcomeResult.name) {
                case 'Guardian':
                    thumbnail = Guardian;
                    break;
                case 'Mentor':
                    thumbnail = Mentor;
                    break;
                case 'Invisible Force':
                    thumbnail = Invisible;
                    break;
                case 'Healer':
                    thumbnail = Healer;
                    break;
            }
            let Attachment = new AttachmentBuilder(thumbnail);
            Attachment.setName('outcome.png');

            // add button
            const button = new ButtonBuilder()
                .setStyle('Primary')
                .setLabel('Claim role')
                .setCustomId('ClaimRole');
            const actionRow = new ActionRowBuilder()
                .addComponents(button);



            // render outcome
            const content = new EmbedBuilder()
                .setTitle(`${outcomeResult.name}`)
                .setAuthor({
                    name: outcomeResult.linkName ? outcomeResult.linkName : null,
                    url: outcomeResult.link ? outcomeResult.link : null
                })
                .setURL(outcomeResult.link ? outcomeResult.link : null)
                .setThumbnail('attachment://outcome.png')
                .setDescription(
                    `${outcomeResult.description} ${
                        outcomeResult.extra ? `\n\n ${outcomeResult.extra}` : ''
                    }`
                )
                .setColor(`${outcomeResult.color}`);
            interaction.update({embeds: [content], components: [actionRow], files: [Attachment], ephemeral: true});
            // remove user from game
            games.get(guildID).users.delete(userID);
            

            
            // use quizSchema to fill the following fields
            const data = {
                guild: guildID,
                member: userID,
                outcome: outcomeResult.name,
                time: Date.now()
            }

            // insert or update
            await quizSchema.findOneAndUpdate({
                guild: guildID,
                member: userID
            }, data, { upsert: true });

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