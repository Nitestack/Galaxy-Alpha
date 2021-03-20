"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ModelBase_1 = require("@models/ModelBase");
//TODO: Everytime update the interfaces, when updating the schema
const levelSchema = new mongoose_1.Schema({
    userID: ModelBase_1.requiredString,
    guildID: ModelBase_1.requiredString,
    xp: ModelBase_1.requiredDefaultNumber,
    level: ModelBase_1.requiredDefaultNumber,
    messages: ModelBase_1.requiredDefaultNumber,
    lastUpdated: ModelBase_1.requiredDefaultDate
});
;
;
exports.default = mongoose_1.model('Level', levelSchema, 'levels');
//# sourceMappingURL=level.js.map