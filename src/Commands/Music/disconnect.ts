import Command from '@root/Command';
export const name = 'disconnect';
export const description = "Disconnects the bot from a voice channel";
export const category = "music";
export const usage = "disconnect";
export const aliases = ['dis'];

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
    async run(client, message, args, prefix) {
        const botChannel = message.guild.me.voice.channel;
        if (botChannel) {
            botChannel.leave();
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