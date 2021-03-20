"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ModelBase_1 = require("@models/ModelBase");
;
;
//TODO: Everytime update the interfaces, when updating the schema
const guildSchema = new mongoose_1.Schema({
    guildID: ModelBase_1.requiredString,
    prefix: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        default: process.env.GLOBAL_PREFIX
    },
    modLogChannelID: mongoose_1.SchemaTypes.String,
    modLogChannelWebhookToken: mongoose_1.SchemaTypes.String,
    modLogChannelWebhookID: mongoose_1.SchemaTypes.String,
    muteRoleID: mongoose_1.SchemaTypes.String,
    memberRoleID: mongoose_1.SchemaTypes.String,
    ticketCategoryID: mongoose_1.SchemaTypes.String,
    ticketManagerRoleID: mongoose_1.SchemaTypes.String,
    giveawayManagerRoleID: mongoose_1.SchemaTypes.String,
    giveawayBlacklistedRoleID: mongoose_1.SchemaTypes.String,
    giveawayByPassRoleID: mongoose_1.SchemaTypes.String,
    serverManagerRoleID: mongoose_1.SchemaTypes.String,
    welcomeMessageType: {
        type: mongoose_1.SchemaTypes.String,
        default: "message"
    },
    welcomeChannelID: mongoose_1.SchemaTypes.String,
    welcomeMessage: mongoose_1.SchemaTypes.String,
    modMailManagerRoleID: mongoose_1.SchemaTypes.String,
    modMailLogChannelID: mongoose_1.SchemaTypes.String,
    modMailCategoryID: mongoose_1.SchemaTypes.String,
    DJRoleID: mongoose_1.SchemaTypes.String,
    suggestionChannelID: mongoose_1.SchemaTypes.String,
    reactionRoles: {
        type: [{
                emojiID: mongoose_1.SchemaTypes.String,
                roleID: mongoose_1.SchemaTypes.String,
                messageID: mongoose_1.SchemaTypes.String
            }],
        default: []
    },
    ignoreChannels: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    autoPublishChannels: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    autoSuggestionChannel: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    blacklistedWords: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    autoMod: {
        type: {
            blacklistedWords: mongoose_1.SchemaTypes.Array,
            deletingLinks: mongoose_1.SchemaTypes.Boolean,
            deletingImages: mongoose_1.SchemaTypes.Boolean,
            spam: {
                cooldown: mongoose_1.SchemaTypes.Number,
                messageLimit: mongoose_1.SchemaTypes.Number,
                timer: mongoose_1.SchemaTypes.Number
            }
        },
        default: {
            blacklistedWords: [],
            deletingLinks: false,
            deletingImages: false,
            spam: {
                cooldown: 0,
                messageLimit: 0,
                timer: 0
            }
        }
    },
    suggestionManagerRoleID: mongoose_1.SchemaTypes.String,
    chatBot: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    }
});
exports.default = mongoose_1.model('guild', guildSchema, 'guilds');
//# sourceMappingURL=guild.js.map