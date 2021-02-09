import Discord from "discord.js";

export default class GalaxyAlphaUtil {
    public permissions: Array<Discord.PermissionString> = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS'
    ];

    public permissionsShowCase: Array<string> = [
        "Create Invite",
        "Kick Members",
        "Ban Members",
        "Administrator",
        "Manage Channels",
        "Manage Server",
        "Add Reactions",
        "View Audit Log",
        "Priority Speaker",
        "Video",
        "View Channels",
        "Send Messages",
        "Send Text-to-Speech Messages",
        "Manage Messages",
        "Embed Links",
        "Attach Files",
        "Read Message History",
        "Mention @everyone, @here, and All Roles",
        "Use External Emoji",
        "View Server Insights",
        "Connect",
        "Speak",
        "Mute Members",
        "Deafen Members",
        "Move Members",
        "Use Voice Activity",
        "Change Nickname",
        "Manage Nicknames",
        "Manage Roles",
        "Manage Webhooks",
        "Manage Emojis"
    ];

    public validEvents = [
        'channelCreate',
        'channelDelete',
        'guildBanRemove',
        'guildUnavailable',
        'guildDelete',
        'emojiCreate',
        'emojiDelete',
        'emojiUpdate',
        'guildIntegrationsUpdate',
        'guildMemberRemove',
        'guildMemberUpdate',
        'guildMemberAvailable',
        'roleCreate',
        'roleDelete',
        'roleUpdate',
        'guildUpdate',
        'inviteCreate',
        'inviteDelete',
        'message',
        'messageDelete',
        'messageDeleteBulk',
        'messageReactionAdd',
        'messageReactionRemove',
        'messageReactionRemoveAll',
        'messageReactionRemoveEmoji',
        'presenceUpdate',
        'typingStart',
        'userUpdate',
        'voiceStateUpdate',
        'webhookUpdate',
        'warn',
        'debug',
        'guildMemberSpeaking',
        'channelPinsUpdate',
        'channelUpdate',
        'guildBanAdd',
        'guildCreate',
        'guildMemberAdd',
        'guildMembersChunk',
        'messageUpdate',
        'shardResume',
        'shardReady',
        'shardDisconnect',
        'shardReconnecting',
        'invalidated',
        'shardError',
        'rateLimit',
        'error',
        'modMail'
    ];

    public weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    public monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    public getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    };

    public getDuration(milliseconds: number): string {
        if (!milliseconds || isNaN(milliseconds)) return "00:00";
        const seconds = Math.floor(milliseconds % 60000 / 1000);
        const minutes = Math.floor(milliseconds % 3600000 / 60000);
        const hours = Math.floor(milliseconds / 3600000);
        if (hours > 0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
        if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
        return `00:${formatInt(seconds)}`;
        function formatInt(int: number) {
            if (int < 10) return `0${int}`;
            return `${int}`;
        };
    };

    public toUpperCaseBeginning(string: string): string {
        return `${string[0].toUpperCase() + string.slice(1).toLowerCase()}`;
    };

    public getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    };
};