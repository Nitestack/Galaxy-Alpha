import { SchemaTypes, model, Document, Schema } from 'mongoose';
import { requiredDefaultDate, requiredString } from '@models/ModelBase';

//TODO: Everytime update the interfaces, when updating the schema
const giveawaySchema = new Schema({
	guildID: requiredString,
	channelID: requiredString,
	hostedBy: requiredString,
	messageID: requiredString,
	startsOn: requiredDefaultDate,
	endsOn: requiredDefaultDate,
	winners: {
		type: SchemaTypes.Number,
		required: true,
		default: 1
	},
	hasEnded: {
		type: SchemaTypes.Boolean,
		required: true,
		default: false
	},
	duration: {
		type: SchemaTypes.Number,
		required: true,
		default: 0
	},
	prize: requiredString,
});

//TODO: Everytime update the interfaces, when updating the schema
export interface GiveawaySchema extends Document {
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

export default model<GiveawaySchema>('Giveaway', giveawaySchema, "giveaways");