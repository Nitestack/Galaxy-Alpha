import { SchemaTypes, model, Document, Schema } from 'mongoose';

const reqString = {
    type: SchemaTypes.String,
    required: true
};

//TODO: Everytime update the interfaces, when updating the schema
const levelSchema = new Schema({
    userID: reqString,
    guildID: reqString,
    xp: {
        type: SchemaTypes.Number,
        default: 0
    }, 
    level: {
        type: SchemaTypes.Number,
        default: 0
    },
    messages: {
        type: SchemaTypes.Number,
        default: 0
    },
    lastUpdated: {
        type: SchemaTypes.Date,
        default: new Date
    }
});

//TODO: Everytime update the interfaces, when updating the schema
export interface Level {
    userID: string,
    guildID: string,
    xp: number,
    level: number,
    messages: number,
    lastUpdated: Date
};

//TODO: Everytime update the interfaces, when updating the schema
interface LevelDocument extends Document {
    userID: string,
    guildID: string,
    xp: number,
    level: number,
    messages: number,
    lastUpdated: Date
};

export default model<LevelDocument>('Level', levelSchema, 'levels');