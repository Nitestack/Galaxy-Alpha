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
        const msg = await message.channel.send(client.createEmbed()
            .setTitle("💥 Nuke Manager")
            .setDescription("Do you really want to nuke this channel?\n\nYou have 30s to react!"));
        await msg.react(client.yesEmojiID);
        await msg.react(client.noEmojiID);    
        const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { time: 30000, max: 1 });
        YesOrNo.on("collect", async (reaction, user) => {
            if (reaction.emoji.id == client.yesEmojiID) {
                const newChannel = await(message.channel as TextChannel | NewsChannel).clone();
                newChannel.setPosition((message.channel as TextChannel | NewsChannel).position);
                await message.channel.delete();
                return newChannel.send(client.createEmbed()
                    .setTitle("💥 Nuke")
                    .setDescription("This channel has been nuked!"));
            } else {
                return client.createArgumentError(message, { title: "💥 Nuke Manager", description: "Nuking channel cancelled!" }, this.usage);
            };
        });
        YesOrNo.on("end", (collected, reason) => {
            if (collected.size == 0) return client.createArgumentError(message, { title: "💥 Nuke Manager", description: "Nuking channel cancelled!" }, this.usage);
        });
    };
};