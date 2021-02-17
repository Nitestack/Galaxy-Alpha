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
    messageID: mongoose.SchemaTypes.String,
    channelID: mongoose.SchemaTypes.String,
    title: mongoose.SchemaTypes.String,
    description: mongoose.SchemaTypes.String,
    emojiIDs: [mongoose.SchemaTypes.String],
    roleIDs: [mongoose.SchemaTypes.String]
});

export default mongoose.model<ReactionRoleSchema>("Reaction Roles", reactionRolesSchema, "reaction-roles");