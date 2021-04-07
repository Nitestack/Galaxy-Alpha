import { SchemaTypes, model, Document, Schema } from 'mongoose';
import { requiredString } from '@models/ModelBase';

//TODO: Everytime update the interfaces, when updating the schema
export interface Guild {
	guildID?: string,
	prefix?: string,
	modLogChannelID?: string,
	modLogChannelWebhookToken?: string,
	modLogChannelWebhookID?: string,
	muteRoleID?: string,
	memberRoleID?: string,
	giveawayManagerRoleID?: string,
	giveawayBlacklistedRoleID?: string,
	giveawayByPassRoleID?: string,
	serverManagerRoleID?: string,
	welcomeMessage?: string,
	welcomeMessageType?: "embed" | "message",
	welcomeChannelID?: string | "dm",
	modMailManagerRoleID?: string,
	modMailLogChannelID?: string,
	modMailCategoryID?: string,
	DJRoleID?: string,
	reactionRoles?: Array<{
		emojiID: string,
		roleID: string,
		messageID: string
	}>,
	ignoreChannels?: Array<string>,
	autoPublishChannels?: Array<string>,
	autoSuggestionChannel?: Array<string>,
	blacklistedWords?: Array<string>,
	autoMod?: {
		blacklistedWords: Array<string>,
		deletingLinks: boolean,
		deletingImages: boolean,
		spam: {
			cooldown: number,
			messageLimit: number,
			timer: number
		}
	},
	chatBot?: Array<string>,
	customCommands?: Array<CustomCommand>,
	application?: {
		questions: Array<string>,
		logChannelID: string,
		managerRoleID: string,
		categoryID: string
	},
	ticket?: {
		categoryID: string,
		managerRoleID: string
	},
	suggestion?: {
		managerRoleID: string,
		channelID: string
	}
};

export interface CustomCommand {
    guildID: string,
    name: string,
    aliases: Array<string>,
    allowedRoles: Array<string>,
    notAllowedRoles: Array<string>,
    allowedChannels: Array<string>,
    notAllowedChannels: Array<string>,
    answers: Array<string>,
	random: boolean
};

//TODO: Everytime update the interfaces, when updating the schema
interface GuildDocument extends Guild, Document { };

//TODO: Everytime update the interfaces, when updating the schema
const guildSchema = new Schema({
	guildID: requiredString,
	prefix: {
		type: SchemaTypes.String,
		required: true,
		default: process.env.GLOBAL_PREFIX
	},
	modLogChannelID: SchemaTypes.String,
	modLogChannelWebhookToken: SchemaTypes.String,
	modLogChannelWebhookID: SchemaTypes.String,
	muteRoleID: SchemaTypes.String,
	memberRoleID: SchemaTypes.String,
	giveawayManagerRoleID: SchemaTypes.String,
	giveawayBlacklistedRoleID: SchemaTypes.String,
	giveawayByPassRoleID: SchemaTypes.String,
	serverManagerRoleID: SchemaTypes.String,
	welcomeMessageType: {
		type: SchemaTypes.String,
		default: "message"
	},
	welcomeChannelID: SchemaTypes.String,
	welcomeMessage: SchemaTypes.String,
	modMailManagerRoleID: SchemaTypes.String,
	modMailLogChannelID: SchemaTypes.String,
	modMailCategoryID: SchemaTypes.String,
	DJRoleID: SchemaTypes.String,
	suggestionChannelID: SchemaTypes.String,
	reactionRoles: {
		type: [{
			emojiID: SchemaTypes.String,
			roleID: SchemaTypes.String,
			messageID: SchemaTypes.String
		}],
		default: []
	},
	ignoreChannels: {
		type: SchemaTypes.Array,
		default: []
	},
	autoPublishChannels: {
		type: SchemaTypes.Array,
		default: []
	},
	autoSuggestionChannel: {
		type: SchemaTypes.Array,
		default: []
	},
	blacklistedWords: {
		type: SchemaTypes.Array,
		default: []
	},
	autoMod: {
		type: {
			blacklistedWords: SchemaTypes.Array,
			deletingLinks: SchemaTypes.Boolean,
			deletingImages: SchemaTypes.Boolean,
			spam: {
				cooldown: SchemaTypes.Number,
				messageLimit: SchemaTypes.Number,
				timer: SchemaTypes.Number
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
	suggestionManagerRoleID: SchemaTypes.String,
	chatBot: {
		type: SchemaTypes.Array,
		default: []
	},
	customCommands: {
		type: [{
			name: requiredString,
			aliases: {
				type: SchemaTypes.Array,
				default: []
			},
			allowedRoles: {
				type: SchemaTypes.Array,
				default: []
			},
			notAllowedRoles: {
				type: SchemaTypes.Array,
				default: []
			},
			allowedChannels: {
				type: SchemaTypes.Array,
				default: []
			},
			notAllowedChannels: {
				type: SchemaTypes.Array,
				default: []
			},
			answers: {
				type: SchemaTypes.Array,
				default: []
			},
			random: {
				type: SchemaTypes.Boolean,
				default: false
			}
		}],
		default: []
	},
	application: {
		type: {
			questions: SchemaTypes.Array,
			logChannelID: SchemaTypes.String,
			managerRoleID: SchemaTypes.String,
			categoryID: SchemaTypes.String
		},
		default: {
			questions: [],
			logChannelID: null,
			managerRoleID: null,
			categoryID: null
		}
	},
	ticket: {
		type: {
			categoryID: SchemaTypes.String,
			managerRoleID: SchemaTypes.String
		},
		default: {
			categoryID: null,
			managerRoleID: null
		}
	},
	suggestion: {
		type: {
			channelID: SchemaTypes.String,
			managerRoleID: SchemaTypes.String
		},
		default: {
			channelID: null,
			managerRoleID: null
		}
	}
});

export default model<GuildDocument>('guild', guildSchema, 'guilds');