"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ModelBase_1 = require("@models/ModelBase");
;
;
//TODO: Everytime update the interfaces, when updating the schema
const profileSchema = new mongoose_1.Schema({
    userID: ModelBase_1.requiredString,
    wallet: ModelBase_1.requiredDefaultNumber,
    bank: ModelBase_1.requiredDefaultNumber,
    messageCount: ModelBase_1.requiredDefaultNumber,
    passive: ModelBase_1.requiredDefaultNumber,
    items: {
        type: mongoose_1.SchemaTypes.Array,
        default: []
    },
    profileCreatedAt: ModelBase_1.requiredDefaultDate
});
exports.default = mongoose_1.model('profile', profileSchema, 'profiles');
//# sourceMappingURL=profile.js.map