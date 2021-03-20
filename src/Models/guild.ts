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
	ticketCategoryID?: string,
	ticketManagerRoleID?: string,
	giveawayManagerRoleID?: string,
	giveawayBlacklistedRoleID?: string,
	giveawayByPassRoleID?: string,
	serverManagerRoleID?: string,
	suggestionChannelID?: string,
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
	suggestionManagerRoleID?: string,
	chatBot?: Array<string>
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
	ticketCategoryID: SchemaTypes.String,
	ticketManagerRoleID: SchemaTypes.String,
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
	}
});

export default model<GuildDocument>('guild', guildSchema, 'guilds');