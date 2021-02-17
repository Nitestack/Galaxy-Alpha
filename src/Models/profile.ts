import mongoose from 'mongoose';

const reqString = {
	type: mongoose.SchemaTypes.String,
	required: true,
};

export interface Profile extends mongoose.Document {
	userID: string;
	wallet: number;
	bank: number;
	messageCount: number;
	passive: boolean;
	items: Array<{
		name: string,
		aliases?: Array<string>,
		amount: number,
		worth: number,
		category: "Loot" | "Utilty"
	}>
};

const profileSchema = new mongoose.Schema({
	userID: reqString,
	wallet: {
		type: mongoose.SchemaTypes.Number,
		required: true,
		default: 0,
	},
	bank: {
		type: mongoose.SchemaTypes.Number,
		required: true,
		default: 0,
	},
	messageCount: {
		type: mongoose.SchemaTypes.Number,
		required: true,
		default: 0,
	},
	passive: {
		type: mongoose.SchemaTypes.Boolean,
		required: true,
		default: false
	},
	items: [{
		name: mongoose.SchemaTypes.String,
		aliases: [mongoose.SchemaTypes.String],
		amount: {
			type: mongoose.SchemaTypes.Number,
			default: 0
		},
		worth: {
			type: mongoose.SchemaTypes.Number,
			default: 0
		},
		category: mongoose.SchemaTypes.String
	}]
});

export default mongoose.model<Profile>('profile', profileSchema, 'profiles');
