import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    guildID: mongoose.SchemaTypes.String,
    channelID: mongoose.SchemaTypes.String,
    categoryID: mongoose.SchemaTypes.String,
    userID: mongoose.SchemaTypes.String,
    reason: mongoose.SchemaTypes.String,
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        default: new Date()
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