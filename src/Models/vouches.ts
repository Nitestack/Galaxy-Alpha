import mongoose from 'mongoose';

export interface Vouch extends mongoose.Document {
	userID: string;
	upVotes: number;
	downVotes: number;
	lastUpdated: Date;
};

const vouchSchema = new mongoose.Schema({
	userID: String,
	upVotes: {
		type: Number,
		default: 0
	},
	downVotes: {
		type: Number,
		default: 0
	},
	lastUpdated: {
		type: Date,
		default: new Date()
	}
});

export default mongoose.model<Vouch>('vouch', vouchSchema, 'vouches');
