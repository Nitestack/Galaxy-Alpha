import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
export interface Vouch extends Document {
	userID: string;
	upVotes: number;
	downVotes: number;
	lastUpdated: Date;
};

//TODO: Everytime update the interfaces, when updating the schema
const vouchSchema = new Schema({
	userID: SchemaTypes.String,
	upVotes: {
		type: SchemaTypes.Number,
		default: 0
	},
	downVotes: {
		type: SchemaTypes.Number,
		default: 0
	},
	lastUpdated: {
		type: SchemaTypes.Date,
		default: new Date()
	}
});

export default model<Vouch>('vouch', vouchSchema, 'vouches');