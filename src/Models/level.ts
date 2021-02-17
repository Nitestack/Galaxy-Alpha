import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
    userID: mongoose.SchemaTypes.String,
    guildID: mongoose.SchemaTypes.String,
    xp: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    }, 
    level: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    messages: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    }
});

export interface Level extends mongoose.Document {
    userID: string,
    guildID: string,
    xp: number,
    level: number,
    messages: number
};

export default mongoose.model<Level>('Level', levelSchema, 'levels');