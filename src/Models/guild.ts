import mongoose from 'mongoose';

export interface Guild extends mongoose.Document {
	guildID: string;
	guildPrefix: string;
	logChannelID: string;
	guildShardID: number;
	muteRole: string;
	memberRole: string;
	ticketCategoryID: string;
	ticketRole: string;
	giveawayManager: string;
	giveawayByPass: string;
	giveawayBlackListed: string;
	giveawayPing: string;
	welcomeMessage: string;
	welcomeEmbed: boolean;
	welcomeChannelID: string;
	modMailManager: string;
	modMailCategory: string;
	modMailLogChannel: string;
};

const reqString = {
	type: String,
	required: true,
};
const guildSchema = new mongoose.Schema({
	guildID: reqString,
	guildPrefix: reqString,
	logChannelID: String,
	muteRole: String,
	memberRole: String,
	ticketCategoryID: String,
	ticketRole: String,
	giveawayManager: String,
	giveawayByPass: String,
	giveawayBlackListed: String,
	welcomeMessage: String,
	welcomeEmbed: {
		type: Boolean,
		default: false
	},
	welcomeChannelID: String,
	modMailManager: String,
	modMailCategory: String,
	modMailLogChannel: String
});

export default mongoose.model<Guild>('guild', guildSchema, 'guilds');