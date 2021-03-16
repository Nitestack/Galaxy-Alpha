import { model, Schema, SchemaTypes, Document } from "mongoose";
import { requiredString } from "@models/ModelBase";

export interface Birthday {
    userID: string,
    birthday: Date
};

interface BirthdayDocument extends Birthday, Document { };

export default model<BirthdayDocument>("birthday", new Schema({
    userID: requiredString,
    birthday: {
        type: SchemaTypes.Date,
        required: true
    }
}), "birthdays");