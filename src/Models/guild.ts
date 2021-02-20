import { SchemaTypes, model, Document, Schema } from 'mongoose';
import { requiredString } from '@models/ModelBase';

//TODO: Everytime update the interfaces, when updating the schema
export interface Guild {
	guildID: string,
	prefix: string,
	modLogChannelID: string,
	modLogChannelWebhookToken: string,
	modLogChannelWebhookID: string,
	muteRoleID: string,
	memberRoleID: string,
	ticketCategoryID: string,
	ticketManagerRoleID: string,
	giveawayManagerRoleID: string,
	giveawayBlacklistedRoleID: string,
	giveawayByPassRoleID: string,
	serverManagerRoleID: string,
	welcomeMessage: string,
	welcomeMessageType: "embed" | "message",
	welcomeChannelID: string | "dm",
	modMailManagerRoleID: string,
	modMailLogChannelID: string,
	modMailCategoryID: string,
	DJRoleID: string,
	reactionRoles: Array<{
		emojiID: string,
		roleID: string,
		messageID: string,
		channelID: string
	}>
};

//TODO: Everytime update the interfaces, when updating the schema
interface GuildDocument extends Document {
	guildID: string,
	prefix: string,
	modLogChannelID: string,
	modLogChannelWebhookToken: string,
	modLogChannelWebhookID: string,
	muteRoleID: string,
	memberRoleID: string,
	ticketCategoryID: string,
	ticketManagerRoleID: string,
	giveawayManagerRoleID: string,
	giveawayBlacklistedRoleID: string,
	giveawayByPassRoleID: string,
	serverManagerRoleID: string,
	welcomeMessage: string,
	welcomeMessageType: "embed" | "message",
	welcomeChannelID: string | "dm",
	modMailManagerRoleID: string,
	modMailLogChannelID: string,
	modMailCategoryID: string,
	DJRoleID: string,
	reactionRoles: Array<{
		emojiID: string,
		roleID: string,
		messageID: string,
		channelID: string
	}>
};

//TODO: Everytime update the interfaces, when updating the schema
const guildSchema = new Schema({
	guildID: requiredString,
	prefix: {
		type: SchemaTypes.String,
		required: true,
		default: process.env.GLOBAL_PREFIX
	},
	modLogChannelID: requiredString,
	modLogChannelWebhookToken: requiredString,
	modLogChannelWebhookID: requiredString,
	muteRoleID: requiredString,
	memberRoleID: requiredString,
	ticketCategoryID: requiredString,
	ticketManagerRoleID: requiredString,
	giveawayManagerRoleID: requiredString,
	giveawayBlacklistedRoleID: requiredString,
	giveawayByPassRoleID: requiredString,
	serverManagerRoleID: requiredString,
	welcomeMessageType: {
		type: SchemaTypes.String,
		required: true,
		default: "message"
	},
	welcomeChannelID: requiredString,
	welcomeMessage: requiredString,
	modMailManagerRoleID: requiredString,
	modMailLogChannelID: requiredString,
	modMailCategoryID: requiredString,
	DJRoleID: requiredString,
	reactionRoles: {
		type: [{
			emojiID: SchemaTypes.String,
			roleID: SchemaTypes.String,
			messageID: SchemaTypes.String,
			channelID: SchemaTypes.String
		}],
		required: true,
		default: []
	}
});


export default model<GuildDocument>('guild', guildSchema, 'guilds');