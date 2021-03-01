import { model, Document, Schema } from 'mongoose';
import { requiredDefaultDate, requiredDefaultNumber, requiredString } from '@models/ModelBase';


//TODO: Everytime update the interfaces, when updating the schema
const levelSchema = new Schema({
    userID: requiredString,
    guildID: requiredString,
    xp: requiredDefaultNumber, 
    level: requiredDefaultNumber,
    messages: requiredDefaultNumber,
    lastUpdated: requiredDefaultDate
});

//TODO: Everytime update the interfaces, when updating the schema
export interface Level {
    userID?: string,
    guildID?: string,
    xp?: number,
    level?: number,
    messages?: number,
    lastUpdated: Date
};

//TODO: Everytime update the interfaces, when updating the schema
interface LevelDocument extends Level, Document { };

export default model<LevelDocument>('Level', levelSchema, 'levels');