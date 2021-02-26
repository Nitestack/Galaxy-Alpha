import Command, { CommandRunner } from "@root/Command";

export default class VolumeCommand extends Command {
    constructor() {
        super({
            name: "volume",
            description: "set's the volume of the voice connection",
            category: "music",
            usage: "volume or volume set",
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const dispatcher = client.queue.get(message.guild.id) ? (client.queue.get(message.guild.id).dispatcher ? client.queue.get(message.guild.id).dispatcher : null) : null;
        if (!dispatcher) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("There is no voice connection!"));
        if (args[0] && args[0].toLowerCase() == "set") {
            if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in a voice channel to use this command!"));
            if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            if (!args[1] || isNaN(args[1] as unknown as number) || parseInt(args[1]) > 100 || parseInt(args[1]) < 0) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to provide a volume between 0 and 100!"));
            client.music.setVolume(message, parseInt(args[1]));
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Set the volume to: \`${args[1]}\``));
        } else {
            return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription(`The current volume is: \`${client.music.getServerQueue(message).volume}\``));
        };
    };
};