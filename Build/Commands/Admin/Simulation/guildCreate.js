"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class GuildCreateCommand extends Command_1.default {
    constructor() {
        super({
            name: "guildcreate",
            description: "simulates a new guild",
            category: "developer",
            developerOnly: true,
            usage: "guildcreate [guild ID]",
            args: [{
                    type: "guild",
                    required: true,
                    index: 1,
                    errorTitle: "Simulation Manager",
                    errorMessage: "You have to provide a valid guild ID!",
                    default: (message) => message.channel.type == "dm" ? null : message.guild
                }]
        });
        this.run = async (client, message, args, prefix) => {
            return client.emit("guildCreate", args[0]);
        };
    }
    ;
}
exports.default = GuildCreateCommand;
;
//# sourceMappingURL=guildCreate.js.map