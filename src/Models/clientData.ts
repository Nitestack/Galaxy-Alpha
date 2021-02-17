import mongoose from 'mongoose';

const clientDataSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	autoPublishChannels: [mongoose.SchemaTypes.String],
	blockedUser: [mongoose.SchemaTypes.String],
	autoPollChannels: [mongoose.SchemaTypes.String]
});

export interface ClientData extends mongoose.Document {
	_id?: mongoose.Schema.Types.ObjectId;
	autoPublishChannels?: Array<string>;
	blockedUser?: Array<string>;
	autoPollChannels?: Array<string>;
};

export default mongoose.model<ClientData>('clientData', clientDataSchema, 'autopublishchannels'); 