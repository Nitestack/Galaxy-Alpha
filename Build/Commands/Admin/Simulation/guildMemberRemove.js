"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class GuildMemberRemoveCommand extends Command_1.default {
    constructor() {
        super({
            name: "guildmemberremove",
            description: "simulates a server leave",
            category: "developer",
            developerOnly: true,
            guildOnly: true,
            usage: "guildmemberremove [@User/User ID]"
        });
        this.run = async (client, message, args, prefix) => {
            let member = message.member;
            if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id))
                member = message.guild.members.cache.get(message.mentions.users.first().id);
            if (args[0] && message.guild.members.cache.has(args[0]))
                member = message.guild.members.cache.get(args[0]);
            return client.emit("guildMemberRemove", member);
        };
    }
    ;
}
exports.default = GuildMemberRemoveCommand;
;
//# sourceMappingURL=guildMemberRemove.js.map