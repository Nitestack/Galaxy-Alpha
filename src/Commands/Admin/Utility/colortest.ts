import Command, { CommandRunner } from '@root/Command';

export default class ColortestCommand extends Command {
    constructor() {
        super({
            name: "colortest",
            description: "sends an embed with the color as the embed color",
            usage: "colortest <color hex code>",
            aliases: ["ct", "colort", "ctets"],
            developerOnly: true,
            category: "developer",
            args: [{
                type: "text",
                required: true,
                errorTitle: "🎨 Color Test Manager",
                errorMessage: "You have to provide a hex code for the color!\n🔗 [Visit this website for a hex code](https://htmlcolorcodes.com)"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return message.channel.send(client.createEmbed()
            .setTitle("🎨 Color Test Manager")
            .setDescription("⬅️ On the left side you can see the color you choosed for the embed message!")
            .setColor(args[0].toUpperCase()));
    };
};