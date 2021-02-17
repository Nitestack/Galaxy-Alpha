import mongoose from 'mongoose';

export interface Vouch extends mongoose.Document {
	userID: string;
	upVotes: number;
	downVotes: number;
	lastUpdated: Date;
};

const vouchSchema = new mongoose.Schema({
	userID: mongoose.SchemaTypes.String,
	upVotes: {
		type: mongoose.SchemaTypes.Number,
		default: 0
	},
	downVotes: {
		type: mongoose.SchemaTypes.Number,
		default: 0
	},
	lastUpdated: {
		type: mongoose.SchemaTypes.Date,
		default: new Date()
	}
});

export default mongoose.model<Vouch>('vouch', vouchSchema, 'vouches');
