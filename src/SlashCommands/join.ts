import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";
import { VoiceChannel } from "discord.js";

export default class extends SlashCommand {
    constructor() {
        super({
            name: "join",
            description: "Joines a voice channel",
            type: "message"
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        const embed = client.createRedEmbed().setTitle("🎧 Music Manager");
        if (infos.guild.me.voice.channel) return this.data.embeds = embed.setDescription(`The bot is already in the channel \`${infos.guild.me.voice.channel.name}\`!`);
        const voiceChannel: VoiceChannel = infos.member.voice.channel;
        if (!voiceChannel) return this.data.embeds = embed.setDescription('You need to be in a voice channel to use this command!');
        const permissions = voiceChannel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return this.data.embeds = embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!");
        if (!permissions.has('SPEAK')) return this.data.embeds = embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!");
        if (!permissions.has('VIEW_CHANNEL')) return this.data.embeds = embed.setDescription("I need the permission `Connect`, `Speak` and `View Channel` to play music!");
        await infos.member.voice.channel.join();
        return this.data.embeds = client.createGreenEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription(`Joined the voice channel \`${infos.member.voice.channel.name}\`!`);
    };
};
