import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
const clientDataSchema = new Schema({
	_id: Schema.Types.ObjectId,
	blockedUser: [SchemaTypes.String]
});

//TODO: Everytime update the interfaces, when updating the schema
export interface ClientData {
	blockedUser?: Array<string>;
};

interface ClientDataDocument extends ClientData, Document { };

export default model<ClientDataDocument>('clientData', clientDataSchema, 'autopublishchannels'); 