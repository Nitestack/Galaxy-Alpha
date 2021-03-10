import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
const ticketSchema = new Schema({
    channelID: SchemaTypes.String,
    categoryID: SchemaTypes.String,
    userID: SchemaTypes.String,
    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    }
});

//TODO: Everytime update the interfaces, when updating the schema
export interface Ticket {
    channelID: string;
    categoryID: string;
    userID: string;
    createdAt: Date;
};

interface TicketDocument extends Ticket, Document { };

export default model<TicketDocument>("Ticket", ticketSchema, 'tickets');