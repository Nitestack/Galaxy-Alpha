import GalaxyAlpha from '@root/Client';
import Command from '@root/Command';

module.exports = class DisconnectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "disconnect",
            description: "disconnects the bot from a voice channel",
            category: "music",
            aliases: ["dis"],
            guildOnly: true
        });
    };
    async run(client: GalaxyAlpha, message, args, prefix) {
        if (!message.member.voice.channel) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("🎧 Music Manager")
            .setDescription("You have to be in a voice channel to use this command!"));
        const botChannel = message.guild.me.voice.channel;
        if (botChannel) {
            if (message.member.voice.channel.id != botChannel.id) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle("🎧 Music Manager")
                .setDescription("You have to be in the same voice channel as me!"));
            client.music.disconnect(botChannel);
            client.queue.delete(message.guild.id);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`Disconnected from \`${botChannel.name}!\``));
        } else {
            return message.channel.send(client.createRedEmbed()
                .setTitle("🎧 Music Manager")
                .setDescription(`The bot isn't in a voice channel!`));
        };
    };
};