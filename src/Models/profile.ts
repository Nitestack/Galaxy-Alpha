import { SchemaTypes, model, Document, Schema } from 'mongoose';
import { requiredString, requiredDefaultNumber, requiredDefaultDate } from "@models/ModelBase";
import { ShopItem } from "@data/Shop";

//TODO: Everytime update the interfaces, when updating the schema
export interface Profile {
	userID?: string;
	wallet?: number;
	bank?: number;
	messageCount?: number;
	passive?: boolean;
	items?: Array<{
		item: ShopItem
		amount: number
	}>,
	profileCreatedAt?: Date
};

interface ProfileDocument extends Profile, Document { };

//TODO: Everytime update the interfaces, when updating the schema
const profileSchema = new Schema({
	userID: requiredString,
	wallet: requiredDefaultNumber,
	bank: requiredDefaultNumber,
	messageCount: requiredDefaultNumber,
	passive: requiredDefaultNumber,
	items: {
		type: SchemaTypes.Array,
		default: []
	},
	profileCreatedAt: requiredDefaultDate
});

export default model<ProfileDocument>('profile', profileSchema, 'profiles');