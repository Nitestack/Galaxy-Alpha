import mongoose from 'mongoose';

const giveawaySchema = new mongoose.Schema({
	guildID: String,
	channelID: String,
	hostedBy: String,
	messageID: String,
	startsOn: Date,
	endsOn: Date,
	winners: Number,
	hasEnded: Boolean,
	duration: Number,
	prize: String,
});

export interface GiveawaySchema extends mongoose.Document {
	guildID: string;
	channelID: string;
	hostedBy: string;
	messageID: string;
	startsOn: Date;
	endsOn: Date;
	winners: number;
	hasEnded: boolean;
	duration: number;
	prize: string;
};

export default mongoose.model<GiveawaySchema>('Giveaway', giveawaySchema, "giveaways");
