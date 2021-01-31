import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    guildID: String,
    channelID: String,
    categoryID: String,
    userID: String,
    reason: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

interface TicketSchema extends mongoose.Document {
    guildID: string;
    channelID: string;
    categoryID: string;
    userID: string;
    reason: string;
    createdAt: Date;
};

export default mongoose.model<TicketSchema>("Ticket", ticketSchema, 'tickets');