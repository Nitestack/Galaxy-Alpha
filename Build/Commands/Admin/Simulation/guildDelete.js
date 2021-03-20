"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class GuildCreateCommand extends Command_1.default {
    constructor() {
        super({
            name: "guilddelete",
            description: "simulates a new guild",
            category: "developer",
            developerOnly: true,
            usage: "guilddelete [guild ID]"
        });
        this.run = async (client, message, args, prefix) => {
            let guild = message.channel.type != "dm" ? message.guild : null;
            if (args[0] && client.guilds.cache.has(args[0]))
                guild = client.guilds.cache.get(args[0]);
            if (!guild)
                return client.createArgumentError(message, { title: "Simulation Manager", description: "You have to provide a valid guild ID!" }, this.usage);
            return client.emit("guildDelete", guild);
        };
    }
    ;
}
exports.default = GuildCreateCommand;
;
//# sourceMappingURL=guildDelete.js.map