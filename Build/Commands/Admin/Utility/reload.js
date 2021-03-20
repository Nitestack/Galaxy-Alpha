"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class ReloadCommand extends Command_1.default {
    constructor() {
        super({
            name: "reload",
            description: "reloades all commands. events and features",
            category: "developer",
            developerOnly: true
        });
        this.run = async (client, message, args, prefix) => {
            client.start();
            return client.createSuccess(message, { title: "File Manager", description: "Reloaded all commands!" });
        };
    }
    ;
}
exports.default = ReloadCommand;
;
//# sourceMappingURL=reload.js.map