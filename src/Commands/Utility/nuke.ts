import Command, { CommandRunner } from "@root/Command";
import { NewsChannel, TextChannel } from "discord.js";

export default class NukeCommand extends Command {
    constructor(){
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
        const newChannel = await (message.channel as TextChannel | NewsChannel).clone();
        newChannel.setPosition((message.channel as TextChannel | NewsChannel).position);
        await message.channel.delete();
        return newChannel.send(client.createEmbed()
            .setTitle("💥 Nuke")
            .setDescription("This channel has been nuked!"));
    };
};