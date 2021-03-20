"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class DeveloperCommand extends Command_1.default {
    constructor() {
        super({
            name: 'developer',
            description: 'shows all developers and contributors of this bot',
            category: "miscellaneous"
        });
        this.run = async (client, message) => {
            const embed = client.createEmbed()
                .setTitle(`🛠️ ${client.user.username}'s Developer`)
                .addField("Owner:", `<@${client.ownerID}>`);
            if (client.developers.filter(developer => developer != client.ownerID).length != 0)
                embed.addField("Developers:", `<@${client.developers.filter(developer => developer != client.ownerID).join("> <@")}>`);
            if (client.contributors.length != 0)
                embed.addField("Contributors:", `<@${client.contributors.join("> <@")}>`);
            return message.channel.send(embed);
        };
    }
    ;
}
exports.default = DeveloperCommand;
;
//# sourceMappingURL=developer.js.map