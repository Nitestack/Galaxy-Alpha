import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
export interface Member {
	guildID: string,
    memberID: string,
    kickCount: number,
    banCount: number,
    muteCount: number,
    warnCount: number,
    isMuted: Boolean
};

interface MemberDocument extends Member, Document { };

//TODO: Everytime update the interfaces, when updating the schema
const memberSchema = new Schema({
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

export default model<MemberDocument>('member', memberSchema, 'members');