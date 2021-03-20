"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//TODO: Everytime update the interfaces, when updating the schema
const ticketSchema = new mongoose_1.Schema({
    channelID: mongoose_1.SchemaTypes.String,
    categoryID: mongoose_1.SchemaTypes.String,
    userID: mongoose_1.SchemaTypes.String,
    createdAt: {
        type: mongoose_1.SchemaTypes.Date,
        default: new Date()
    }
});
;
;
exports.default = mongoose_1.model("Ticket", ticketSchema, 'tickets');
//# sourceMappingURL=ticket.js.map