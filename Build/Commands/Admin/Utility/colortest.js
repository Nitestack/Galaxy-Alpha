"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class ColortestCommand extends Command_1.default {
    constructor() {
        super({
            name: "colortest",
            description: "sends an embed with the color as the embed color",
            usage: "colortest <color hex code>",
            aliases: ["ct", "colort", "ctets"],
            developerOnly: true,
            category: "developer"
        });
        this.run = async (client, message, args, prefix) => {
            if (args[0])
                return message.channel.send(client.createEmbed()
                    .setTitle("🎨 Color Test Manager")
                    .setDescription("⬅️ On the left side you can see the color you choosed for the embed message!")
                    .setColor(args[0].toUpperCase()));
            else
                return client.createArgumentError(message, { title: "🎨 Color Test Manager", description: "You have to provide a hex code for the color!\n🔗 [Visit this website for a hex code](https://htmlcolorcodes.com)" }, this.usage);
        };
    }
    ;
}
exports.default = ColortestCommand;
;
//# sourceMappingURL=colortest.js.map