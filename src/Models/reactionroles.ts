import mongoose from 'mongoose';

interface ReactionRoleSchema extends mongoose.Document {
    messageID: string;
    channelID: string;
    title: string;
    description: string;
    emojiIDs: Array<string>;
    roleIDs: Array<string>;
};

const reactionRolesSchema = new mongoose.Schema({
    messageID: String,
    channelID: String,
    title: String,
    description: String,
    emojiIDs: [String],
    roleIDs: [String]
});

export default mongoose.model<ReactionRoleSchema>("Reaction Roles", reactionRolesSchema, "reaction-roles");