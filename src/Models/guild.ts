import mongoose from 'mongoose';

export interface Guild extends mongoose.Document {
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
	welcomeMessageType: "embed" | "message",
	welcomeChannelID: string | "dm",
	modMailManagerRoleID: string,
	modMailLogChannelID: string,
	modMailCategoryID: string,
	DJRoleID: string
};

const guildSchema = new mongoose.Schema({
	guildID: {
		type: mongoose.SchemaTypes.String,
		required: true
	},
	prefix: {
		type: mongoose.SchemaTypes.String,
		required: true,
		default: process.env.GLOBAL_PREFIX
	},
	modLogChannelID: mongoose.SchemaTypes.String,
	modLogChannelWebhookToken: mongoose.SchemaTypes.String,
	modLogChannelWebhookID: mongoose.SchemaTypes.String,
	muteRoleID: mongoose.SchemaTypes.String,
	memberRoleID: mongoose.SchemaTypes.String,
	ticketCategoryID: mongoose.SchemaTypes.String,
	ticketManagerRoleID: mongoose.SchemaTypes.String,
	giveawayManagerRoleID: mongoose.SchemaTypes.String,
	giveawayBlacklistedRoleID: mongoose.SchemaTypes.String,
	giveawayByPassRoleID: mongoose.SchemaTypes.String,
	serverManagerRoleID: mongoose.SchemaTypes.String,
	welcomeMessageType: {
		type: mongoose.SchemaTypes.String,
		default: "message"
	},
	welcomeChannelID: mongoose.SchemaTypes.String,
	modMailManagerRoleID: mongoose.SchemaTypes.String,
	modMailLogChannelID: mongoose.SchemaTypes.String,
	modMailCategoryID: mongoose.SchemaTypes.String,
	DJRoleID: mongoose.SchemaTypes.String
});

export default mongoose.model<Guild>('guild', guildSchema, 'guilds');