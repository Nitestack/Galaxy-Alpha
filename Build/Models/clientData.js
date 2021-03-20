"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//TODO: Everytime update the interfaces, when updating the schema
const clientDataSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    blockedUser: [mongoose_1.SchemaTypes.String]
});
;
;
exports.default = mongoose_1.model('clientData', clientDataSchema, 'autopublishchannels');
//# sourceMappingURL=clientData.js.map