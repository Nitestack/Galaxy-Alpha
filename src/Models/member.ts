import mongoose from 'mongoose';

interface MemberSchema extends mongoose.Document {
	_id: mongoose.Schema.Types.ObjectId;
	guildID: string,
    memberID: string,
    kickCount: number,
    banCount: number,
    muteCount: number,
    warnCount: number,
    isMuted: Boolean
};

const memberSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    guildID: mongoose.SchemaTypes.String,
    memberID: mongoose.SchemaTypes.String,
    kickCount: mongoose.SchemaTypes.Number,
    banCount: mongoose.SchemaTypes.Number,
    muteCount: mongoose.SchemaTypes.Number,
    warnCount: mongoose.SchemaTypes.Number,
    isMuted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    }
});

export default mongoose.model<MemberSchema>('member', memberSchema, 'members');