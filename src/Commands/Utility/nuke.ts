import Command, { CommandRunner } from "@root/Command";
import { NewsChannel, TextChannel } from "discord.js";

export default class NukeCommand extends Command {
    constructor() {
        super({
            name: "nuke",
            description: "clones the channel and deletes the old one",
            category: "utility",
            userPermissions: ["MANAGE_CHANNELS"],
            clientPermissions: ["MANAGE_CHANNELS"],
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let channel: TextChannel | NewsChannel = message.channel as TextChannel | NewsChannel;
        if (message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id)) channel = message.mentions.channels.first();
        if (args[0] && message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(args[0])) channel = message.guild.channels.cache.get(args[0]) as TextChannel | NewsChannel;
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
            .setTitle("💥 Nuke Manager")
            .setDescription("Do you really want to nuke this channel?\n\nYou have 30s to react!")), {
                title: "💥 Nuke Manager",
                toHandle: "channel",
                activity: "nuking"
            }, this.usage, async (reaction, user) => {
                const newChannel = await channel.clone();
                newChannel.setPosition(channel.position);
                await channel.delete();
                return newChannel.send(client.createEmbed()
                    .setTitle("💥 Nuke")
                    .setDescription("This channel has been nuked!"));
            });
    };
};