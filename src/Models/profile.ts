import { SchemaTypes, model, Document, Schema } from 'mongoose';
import { requiredString, requiredDefaultNumber, requiredDefaultDate } from "@models/ModelBase";

//TODO: Everytime update the interfaces, when updating the schema
export interface Profile {
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
	}>,
	profileCreatedAt: Date
};

interface ProfileDocuement extends Document {
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
	}>,
	profileCreatedAt: Date
};

//TODO: Everytime update the interfaces, when updating the schema
const profileSchema = new Schema({
	userID: requiredString,
	wallet: requiredDefaultNumber,
	bank: requiredDefaultNumber,
	messageCount: requiredDefaultNumber,
	passive: requiredDefaultNumber,
	items: [{
		name: SchemaTypes.String,
		aliases: [SchemaTypes.String],
		amount: {
			type: SchemaTypes.Number,
			default: 0
		},
		worth: {
			type: SchemaTypes.Number,
			default: 0
		},
		category: SchemaTypes.String
	}],
	profileCreatedAt: requiredDefaultDate
});

export default model<ProfileDocuement>('profile', profileSchema, 'profiles');