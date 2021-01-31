import mongoose from 'mongoose';

interface DropSchema extends mongoose.Document {
	guildID: string;
	channelID: string;
	messageID: string;
	prize: string;
	createdBy: string;
	timeCreated: Date;
};

const dropSchema = new mongoose.Schema({
	guildID: String,
	channelID: String,
	messageID: String,
	prize: String,
	createdBy: String,
	timeCreated: Date
});

export default mongoose.model<DropSchema>('Drop', dropSchema, 'drops');