/**
 * This file is used to validate the events that are being listened to by the bot.
 * If an event is not listed here, it will not be listened to.
 * This includes unofficial events. If you want to use an unofficial event, add it to this file.
 */

module.exports = {
    Events: [
        "applicationCommandCreate",
        "applicationCommandDelete",
        "applicationCommandUpdate",
        "channelCreate",
        "channelDelete",
        "channelPinsUpdate",
        "channelUpdate",
        "debug",
        "emojiCreate",
        "emojiDelete",
        "emojiUpdate",
        "error",
        "guildBanAdd",
        "guildBanRemove",
        "guildCreate",
        "guildDelete",
        "guildIntegrationsUpdate",
        "guildMemberAdd",
        "guildMemberAvailable",
        'guildMemberRemove',
        'guildMembersChunk',
        'guildMemberUpdate',
        'guildUnavailable',
        'guildUpdate',
        'interaction',
        'interactionCreate',
        'invalidated',
        'invalidRequestWarning',
        'inviteCreate',
        'inviteDelete',
        "message",
        'messageCreate',
        'messageDelete',
        'messageDeleteBulk',
        'messageReactionAdd',
        'messageReactionRemove',
        'messageReactionRemoveAll',
        'messageReactionRemoveEmoji',
        'messageUpdate',
        'presenceUpdate',
        'rateLimit',
        'ready',
        'roleCreate',
        'roleDelete',
        'roleUpdate',
        'shardDisconnect',
        "shardError",
        'shardReady',
        "shardReconnecting",
        'shardResume',
        'stageInstanceCreate',
        'stageInstanceDelete',
        'stageInstanceUpdate',
        'stickerCreate',
        'stickerDelete',
        "stickerUpdate",
        "threadCreate",
        "threadDelete",
        "threadListSync",
        "threadMembersUpdate",
        "threadMemberUpdate",
        "threadUpdate",
        "typingStart",
        'userUpdate',
        "voiceStateUpdate",
        "warn",
        "webhookUpdate",
        // Unofficial Events
    ]
}