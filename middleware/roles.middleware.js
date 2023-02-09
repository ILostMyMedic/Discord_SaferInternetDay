const guildSchema = require('../models/guild.model')
const { PermissionsBitField } = require('discord.js');


const roles = [
    {
        name: 'Guardian',
        color: '#2f7b80',
    },
    {
        name: 'Mentor',
        color: '#eab94b',
    },
    {
        name: 'Invisible Force',
        color: '#9e9f34',
    },
    {
        name: 'Healer',
        color: '#d44d8c',
    }
]

const createRoles = async (guild) => {
    const flags = [
        PermissionsBitField.Flags.ManageRoles,
    ];
    const permissions = new PermissionsBitField(flags);
    const guildMemberManager = guild.members

    // check if the bot has the permissions to create roles
    if (!guildMemberManager.me.permissions.has(permissions)) {
        return
    }

    const missingFromDB = []
    const rolesInDB = await guildSchema.findOne({ "details.guildID": guild.id })
    roles.forEach(element => {
        // check that each element.name exists in rolesInDB.roles array under name
        if (!rolesInDB.roles.find(role => role.name === element.name)) {
            missingFromDB.push(element)
        }
    });

    // create missing roles
    const creatingRoles = await missingFromDB.forEach(async element => {
        console.log(element)
        const role = await guild.roles.create({
            name: element.name,
            color: element.color,
        })
        await guildSchema.findOneAndUpdate({ "details.guildID": guild.id }, {
            $push: {
                roles: {
                    name: role.name,
                    id: role.id,
                }
            }
        })
    })

    // return all the new roles
    return await guildSchema.findOne({ "details.guildID": guild.id })
}



module.exports = {
    createRoles,
    roles
}