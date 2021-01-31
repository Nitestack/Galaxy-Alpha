import mongoose from 'mongoose';

interface MessageCountSchema extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId;
	messageGuildID: string,
	messageUserID: string,
	messageCount: number,
	lastUpdated: Date
};

const messagesSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	messageGuildID: String,
	messageUserID: String,
	messageCount: {
		type: Number,
		default: 0,
	},
	lastUpdated: {
		type: Date,
		default: new Date()
	}
});

export default mongoose.model<MessageCountSchema>('message', messagesSchema, 'messages');