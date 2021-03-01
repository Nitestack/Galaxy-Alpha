import Command, { CommandRunner } from "@root/Command";

export default class SeekCommand extends Command {
    constructor(){
        super({
            name: "seek",
            description: "set's the seek of the current song",
            category: "music",
            guildOnly: true,
            usage: "seek <seconds>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[0] && args[0].toLowerCase() == "set") {
            if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in a voice channel to use this command!"));
            if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            if (!args[1] || isNaN(args[1] as unknown as number) || parseInt(args[1]) > client.music.getQueue(message)[0].duration.seconds || parseInt(args[1]) < 0) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to provide a volume between 0 and 100!"));
            client.music.seek(message, parseInt(args[1]) * 1000);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Set the seek to: \`${args[1]}\``));
        } else return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription(`The seek is: \`${client.util.getDuration(client.music.getServerQueue(message).dispatcher.streamTime)}\``));
    };
};