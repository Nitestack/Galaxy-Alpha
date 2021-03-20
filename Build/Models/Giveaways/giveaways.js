"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ModelBase_1 = require("@models/ModelBase");
//TODO: Everytime update the interfaces, when updating the schema
const giveawaySchema = new mongoose_1.Schema({
    guildID: ModelBase_1.requiredString,
    channelID: ModelBase_1.requiredString,
    hostedBy: ModelBase_1.requiredString,
    messageID: ModelBase_1.requiredString,
    startsOn: ModelBase_1.requiredDefaultDate,
    endsOn: ModelBase_1.requiredDefaultDate,
    winners: {
        type: mongoose_1.SchemaTypes.Number,
        required: true,
        default: 1
    },
    hasEnded: {
        type: mongoose_1.SchemaTypes.Boolean,
        required: true,
        default: false
    },
    duration: {
        type: mongoose_1.SchemaTypes.Number,
        required: true,
        default: 0
    },
    prize: ModelBase_1.requiredString,
});
;
;
exports.default = mongoose_1.model('Giveaway', giveawaySchema, "giveaways");
//# sourceMappingURL=giveaways.js.map