import Command, { CommandRunner } from "@root/Command";
import { VoiceChannel } from "discord.js";

export default class JoinCommand extends Command {
    constructor() {
        super({
            name: "join",
            description: "joins a voice channel",
            category: "music",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const embed = client.createRedEmbed(true, `${prefix}${this.usage}`).setTitle("🎧 Music Manager");
        if (message.guild.me.voice.channel) return message.channel.send(embed.setDescription(`The bot is already in the channel \`${message.guild.me.voice.channel.name}\`!`));
        const voiceChannel: VoiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(embed.setDescription('You need to be in a voice channel to use this command!'));
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('SPEAK')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        if (!permissions.has('VIEW_CHANNEL')) return message.channel.send(embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!"));
        message.member.voice.channel.join();
        return message.channel.send(client.createGreenEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription(`Joined the voice channel \`${message.member.voice.channel.name}\`!`));
    };
};