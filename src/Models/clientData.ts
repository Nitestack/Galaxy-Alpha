import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
const clientDataSchema = new Schema({
	_id: Schema.Types.ObjectId,
	autoPublishChannels: [SchemaTypes.String],
	blockedUser: [SchemaTypes.String],
	autoPollChannels: [SchemaTypes.String]
});

//TODO: Everytime update the interfaces, when updating the schema
export interface ClientData {
	_id?: Schema.Types.ObjectId;
	autoPublishChannels?: Array<string>;
	blockedUser?: Array<string>;
	autoPollChannels?: Array<string>;
};

interface ClientDataDocument extends Document {
	_id?: Schema.Types.ObjectId,
	autoPublishChannels?: Array<string>;
	blockedUser?: Array<string>;
	autoPollChannels?: Array<string>;
};

export default model<ClientDataDocument>('clientData', clientDataSchema, 'autopublishchannels'); 