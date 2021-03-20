"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ModelBase_1 = require("@models/ModelBase");
const customSchema = new mongoose_1.Schema({
    guildID: ModelBase_1.requiredString,
    name: ModelBase_1.requiredString,
    aliases: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    allowedRoles: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    notAllowedRoles: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    allowedChannels: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    notAllowedChannels: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    allowedMembers: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    notAllowedMembers: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    answers: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    }
});
;
;
exports.default = mongoose_1.model("custom-command", customSchema, "custom-commands");
//# sourceMappingURL=customCommand.js.map