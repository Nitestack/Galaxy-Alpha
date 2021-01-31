import mongoose from 'mongoose';

interface ModLogsSchema extends mongoose.Document {
    guildID: string;
    channelID: string;
    webhookID: string;
    webhookToken: string;
};

const modlogsSchema = new mongoose.Schema({
    guildID: String,
    channelID: String,
    webhookID: String,
    webhookToken: String
});

export default mongoose.model<ModLogsSchema>("modlog", modlogsSchema, "modlogs");