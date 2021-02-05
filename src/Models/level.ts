import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
    userID: String,
    guildID: String,
    xp: { 
        type: Number, 
        default: 0 
    },
    level: { 
        type: Number, 
        default: 0 
    },
    lastUpdated: { 
        type: Date, 
        default: new Date() 
    },
    messages: {
        type: Number,
        default: 0
    }
});

export interface LevelSchema extends mongoose.Document {
    userID: string,
    guildID: string,
    xp: number,
    level: number,
    messages: number,
    lastUpdated: Date
};

export default mongoose.model<LevelSchema>('Level', levelSchema, 'levels');