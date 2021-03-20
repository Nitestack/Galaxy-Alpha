"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ModelBase_1 = require("@models/ModelBase");
;
//TODO: Everytime update the interfaces, when updating the schema
const dropSchema = new mongoose_1.Schema({
    guildID: ModelBase_1.requiredString,
    channelID: ModelBase_1.requiredString,
    messageID: ModelBase_1.requiredString,
    prize: ModelBase_1.requiredString,
    createdBy: ModelBase_1.requiredString,
    timeCreated: ModelBase_1.requiredDefaultDate
});
exports.default = mongoose_1.model('Drop', dropSchema, 'drops');
//# sourceMappingURL=drops.js.map