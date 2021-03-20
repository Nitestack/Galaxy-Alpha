"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_mongo_1 = __importDefault(require("rate-limit-mongo"));
exports.default = express_rate_limit_1.default({
    max: 300,
    message: 'You are being rate limited.',
    store: new rate_limit_mongo_1.default({ uri: process.env.MONGOPATH }),
    windowMs: 60 * 1000
});
//# sourceMappingURL=rate-limiter.js.map