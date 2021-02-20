import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
export interface Member extends Document {
	_id: Schema.Types.ObjectId;
	guildID: string,
    memberID: string,
    kickCount: number,
    banCount: number,
    muteCount: number,
    warnCount: number,
    isMuted: Boolean
};

//TODO: Everytime update the interfaces, when updating the schema
const memberSchema = new Schema({
	_id: Schema.Types.ObjectId,
    guildID: SchemaTypes.String,
    memberID: SchemaTypes.String,
    kickCount: SchemaTypes.Number,
    banCount: SchemaTypes.Number,
    muteCount: SchemaTypes.Number,
    warnCount: SchemaTypes.Number,
    isMuted: {
        type: SchemaTypes.Boolean,
        default: false
    }
});

export default model<Member>('member', memberSchema, 'members');