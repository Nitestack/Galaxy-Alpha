import { SchemaTypes, model, Schema, Document } from "mongoose";
import { requiredString } from "@models/ModelBase";

const customSchema = new Schema({
    guildID: requiredString,
    name: requiredString,
    aliases: {
        type: SchemaTypes.Array,
        default: []
    },
    allowedRoles: {
        type: SchemaTypes.Array,
        default: []
    },
    notAllowedRoles: {
        type: SchemaTypes.Array,
        default: []
    },
    allowedChannels: {
        type: SchemaTypes.Array,
        default: []
    },
    notAllowedChannels: {
        type: SchemaTypes.Array,
        default: []
    },
    allowedMembers: {
        type: SchemaTypes.Array,
        default: []
    },
    notAllowedMembers: {
        type: SchemaTypes.Array,
        default: []
    },
    answers: {
        type: SchemaTypes.Array,
        default: []
    }
});

export interface CustomCommand {
    guildID: string,
    name: string,
    aliases: Array<string>,
    allowedRoles: Array<string>,
    notAllowedRoles: Array<string>,
    allowedChannels: Array<string>,
    notAllowedChannels: Array<string>,
    allowedMembers: Array<string>,
    notAllowedMembers: Array<string>,
    answers: Array<string>
};

interface CustomCommandDocument extends CustomCommand, Document { };

export default model<CustomCommandDocument>("custom-command", customSchema, "custom-commands");