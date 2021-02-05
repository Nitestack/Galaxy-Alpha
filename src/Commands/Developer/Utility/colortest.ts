import Command, { CommandRunner } from '@root/Command';
import { MessageEmbed } from 'discord.js';

export default class ColortestCommand extends Command {
    constructor(){
        super({
            name: "colortest",
            description: "sends an embed with the color as the embed color",
            usage: "colortest <color hex code>",
            aliases: ["ct", "colort", "ctets"],
            developerOnly: true,
            category: "developer"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[0]) {
            const colorTestEmbed: MessageEmbed = client.createEmbed()
                .setTitle("🎨 Color Test Manager")
                .setDescription("⬅️ On the left side you can see the color you choosed for the embed message!")
                .setColor(args[0].toUpperCase());
            return message.channel.send(colorTestEmbed);
        } else {
            const colorEmbed: MessageEmbed = client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎨 Color Test Manager")
                .setDescription(`You have to provide a hex code for the color!\n🔗 [Visit this website for a hex code](https://htmlcolorcodes.com)`);
            return message.channel.send(colorEmbed);
        };
    };
};