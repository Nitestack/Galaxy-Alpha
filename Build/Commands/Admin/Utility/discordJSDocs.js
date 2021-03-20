"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
const axios_1 = __importDefault(require("axios"));
class DiscordJSDocumentationCommand extends Command_1.default {
    constructor() {
        super({
            name: "discordjsdocs",
            description: "sends an embed help message with the keywords",
            category: "developer",
            usage: "discordjsdocs <keywords>",
            aliases: ["docs"],
            developerOnly: true
        });
        this.run = async (client, message, args, prefix) => {
            if (!args[0])
                return client.createArgumentError(message, { title: "🔖 DiscordJS Documentation Manager", description: "Please provide keywords to search!" }, this.usage);
            const result = await axios_1.default.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(" "))}`);
            if (result.data && !result.data.error)
                return message.channel.send({ embed: result.data });
            else
                return client.createArgumentError(message, { title: "🔖 DiscordJS Documentation Manager", description: `Cannot find any results, that includes\n\`${args.join(" ")}\`!` }, this.usage);
        };
    }
    ;
}
exports.default = DiscordJSDocumentationCommand;
;
//# sourceMappingURL=discordJSDocs.js.map