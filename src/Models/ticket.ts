import { SchemaTypes, model, Document, Schema } from 'mongoose';

//TODO: Everytime update the interfaces, when updating the schema
const ticketSchema = new Schema({
    guildID: SchemaTypes.String,
    channelID: SchemaTypes.String,
    categoryID: SchemaTypes.String,
    userID: SchemaTypes.String,
    reason: SchemaTypes.String,
    createdAt: {
        type: SchemaTypes.Date,
        default: new Date()
    }
});

//TODO: Everytime update the interfaces, when updating the schema
export interface Ticket extends Document {
    guildID: string;
    channelID: string;
    categoryID: string;
    userID: string;
    reason: string;
    createdAt: Date;
};

export default model<Ticket>("Ticket", ticketSchema, 'tickets');