import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
export interface Vouch {
	userID: string;
	upVotes: number;
	downVotes: number;
	lastUpdated: Date;
};

interface VouchDocument extends Vouch, Document { };

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

export default model<VouchDocument>('vouch', vouchSchema, 'vouches');