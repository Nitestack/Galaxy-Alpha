import { model, Document, Schema } from 'mongoose';
import { requiredString, requiredDefaultDate } from "@models/ModelBase";

//TODO: Everytime update the interfaces, when updating the schema
export interface Drop extends Document {
	guildID: string;
	channelID: string;
	messageID: string;
	prize: string;
	createdBy: string;
	timeCreated: Date;
};


//TODO: Everytime update the interfaces, when updating the schema
const dropSchema = new Schema({
	guildID: requiredString,
	channelID: requiredString,
	messageID: requiredString,
	prize: requiredString,
	createdBy: requiredString,
	timeCreated: requiredDefaultDate
});

export default model<Drop>('Drop', dropSchema, 'drops');