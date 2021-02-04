import mongoose from 'mongoose';

const reqString = {
	type: String,
	required: true,
};

export interface ProfileSchema extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId,
	profileID: string;
	wallet: number;
	bank: number;
	messageCount: number;
};

const profileSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	profileID: reqString,
	wallet: {
		type: Number,
		required: true,
		default: 0,
	},
	bank: {
		type: Number,
		required: true,
		default: 0,
	},
	messageCount: {
		type: Number,
		required: true,
		default: 0,
	},
});

export default mongoose.model<ProfileSchema>('profile', profileSchema, 'profiles');
