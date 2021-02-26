import Command, { CommandRunner } from "@root/Command";

export default class ShuffleCommand extends Command {
    constructor() {
        super({
            name: "shuffle",
            description: "shuffles the current queue",
            category: "music",
            guildOnly: true,
            usage: "shuffle <enable/disable>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        if (client.queue.has(message.guild.id) && !client.music.getServerQueue(message).isEmpty) {
            if (client.music.getServerQueue(message).loopMode == 1) return client.createArgumentError(message, { title: "🎧 Music Manager", description: "You cannot enable shuffle if you have single loop enabled!" }, this.usage);
            if (args[0] && args[0].toLowerCase() == "enable") {
                client.music.getServerQueue(message).shuffle = true;
                return message.channel.send(client.createGreenEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("Enabled shuffle!"));
            } else if (args[0] && args[0].toLowerCase() == "disable") {
                client.music.getServerQueue(message).shuffle = false;
                return message.channel.send(client.createGreenEmbed()
                    .setTitle("🎧 Music Manager")
                    .setDescription("Disabled shuffle!"));
            } else {
                return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`)
                    .setTitle("🎧 Music Manager")
                    .setDescription(`Shuffle is ${client.queue.get(message.guild.id).shuffle ? "enabled" : "disabled"}!`));
            };
        } else return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("There is no queue in this server!"));
    };
};