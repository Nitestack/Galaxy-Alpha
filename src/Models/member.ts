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
    guildID: String,
    memberID: String,
    kickCount: Number,
    banCount: Number,
    muteCount: Number,
    warnCount: Number,
    isMuted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model<MemberSchema>('member', memberSchema, 'members');