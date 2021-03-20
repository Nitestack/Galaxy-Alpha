"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undefinedString = exports.requiredDefaultDate = exports.requiredDefaultNumber = exports.nullString = exports.requiredString = void 0;
const mongoose_1 = require("mongoose");
exports.requiredString = {
    type: mongoose_1.SchemaTypes.String,
    required: true
};
exports.nullString = {
    type: mongoose_1.SchemaTypes.String,
    default: null
};
exports.requiredDefaultNumber = {
    type: mongoose_1.SchemaTypes.Number,
    required: true,
    default: 0
};
exports.requiredDefaultDate = {
    type: mongoose_1.SchemaTypes.Date,
    required: true,
    default: new Date()
};
exports.undefinedString = {
    type: mongoose_1.SchemaTypes.String,
    required: true,
    default: undefined
};
//# sourceMappingURL=ModelBase.js.map