import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";

module.exports = class VolumeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "volume",
            description: "set's the volume of the voice connection",
            category: "music"
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        const dispatcher = client.queue.get(message.guild.id).dispatcher || null;
        if (!dispatcher) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no voice connection!"));
        if (!args[0] || !isNaN(args[0]) || parseInt(args[0]) > 100 || parseInt(args[0]) < 1) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to provide a volume between 1 and 100!"));
        if (message.member.voice.channel.id != client.queue.get(message.guild.id).voiceChannel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in the same voice channel as me!"));
        client.music.volume(dispatcher, (args[0] / 100) + 1);
        return message.channel.send(client.createGreenEmbed()
            .setTitle("🎧 Music Manager")
            .setDescription(`Set the volume to: \`${args[0]}\``));
    };
};