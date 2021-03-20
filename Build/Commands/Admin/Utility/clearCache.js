"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class ClearCacheCommand extends Command_1.default {
    constructor() {
        super({
            name: "clearcache",
            description: "clears the cache and uploades the caches data",
            developerOnly: true,
            category: "developer"
        });
        this.run = async (client, message, args, prefix) => {
            client.cache.clearCacheAndSave();
            return client.createSuccess(message, { title: "Cache Manager", description: "Cleared cache and uploaded data to database!" });
        };
    }
    ;
}
exports.default = ClearCacheCommand;
;
//# sourceMappingURL=clearCache.js.map