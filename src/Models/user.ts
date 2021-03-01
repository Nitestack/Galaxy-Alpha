import { SchemaTypes, model, Schema, Document } from "mongoose";
import { requiredString } from "@models/ModelBase";

const userSchema = new Schema({
    userID: requiredString,
    userTag: requiredString,
    userAvatar: requiredString,
    userGuilds: {
        type: SchemaTypes.Array,
        required: true
    }
});

export interface User {
    userID: string,
    userTag: string,
    userAvatar: string,
    userGuilds: Array<object>
};

interface UserDocument extends User, Document {};

export default model<UserDocument>("user", userSchema, "users");