import { SchemaTypes, model, Document, Schema } from 'mongoose';
import { undefinedString } from "@models/ModelBase";

//TODO: Everytime update the interfaces, when updating the schema
export interface Counter {
    guildID: string;
    allMembers: string;
    members: string;
    bots: string;
    roles: string;
    allChannels: string;
    textChannels: string;
    voiceChannels: string;
    categories: string;
    announcements: string;
    allEmojis: string;
    animated: string;
    notAnimated: string;
    boosts: string;
    boostLevel: string;
};

//TODO: Everytime update the interfaces, when updating the schema
const countSchema = new Schema({
    guildID: {
        type: SchemaTypes.String,
        required: true
    },
    allMembers: undefinedString,
    members: undefinedString, 
    bots: undefinedString,
    roles: undefinedString,
    allChannels: undefinedString,
    textChannels: undefinedString,
    voiceChannels: undefinedString,
    categories: undefinedString,
    announcements: undefinedString,
    allEmojis: undefinedString,
    animated: undefinedString,
    notAnimated: undefinedString,
    boosts: undefinedString,
    boostLevel: undefinedString
});

interface CounterDocument extends Counter, Document { };

export default model<CounterDocument>("Counter", countSchema, "counters");