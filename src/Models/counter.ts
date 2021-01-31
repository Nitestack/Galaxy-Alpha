import mongoose from 'mongoose';

const undefinedString = {
    type: String,
    default: undefined
};

export interface counterSchema extends mongoose.Document {
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

const countSchema = new mongoose.Schema({
    guildID: {
        type: String,
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

export default mongoose.model<counterSchema>("Counter", countSchema, "counters");