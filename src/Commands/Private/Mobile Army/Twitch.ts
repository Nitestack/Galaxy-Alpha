import Command from '@root/Command';

module.exports = class TwitchCommand extends Command {
    constructor(client){
        super(client, {
            name: "twitch",
            description: "sends a link to the Mobiel Gamer twitch channel",
            category: "private"
        });
    };
    async run(client, message, args, prefix) {
        if (client.guilds.cache.get("786994097746739231").members.cache.has(message.author.id) && (message.channel.type == 'dm' ? true : message.guild.id == "786994097746739231")) return message.channel.send(client.createEmbed()
            .setTitle("<:twitch:786676150964322394> mobile_rocket_tuniere")
            .setURL("https://www.twitch.tv/mobile_rocket_tuniere")
            .setDescription("🔗 **Link:** https://www.twitch.tv/mobile_rocket_tuniere")
            .setImage(client.guilds.cache.get("786994097746739231").iconURL()));
    };
};