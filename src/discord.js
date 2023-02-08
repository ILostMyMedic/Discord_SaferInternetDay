require("dotenv").config();
const chalk = require("chalk");
const { Client, Collection, Partials, GatewayIntentBits } = require("discord.js");
const { loadEvents } = require("../handlers/events.handler");

const client = new Client({
    // shards: Cluster.data.SHARD_LIST,
    // shardCount: Cluster.data.TOTAL_SHARDS,
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
    fetchAllMembers: true
});


client.commands = new Collection();
client.components = new Collection();



client
    .login(process.env.discord_token)
    .then(() => {
        loadEvents(client, chalk);
    })
    .catch((err) => console.error(err));

module.exports = client;