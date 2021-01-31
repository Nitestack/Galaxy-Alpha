import Command from '@root/Command';
import os from 'os';

module.exports = class InfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "info",
            description: "shows some infos about the bot",
            category: "miscellaneous",
            aliases: ["invite", "stats"]
        });
    };
    async run(client, message) {
        const dateMonthWeek = new Date(client.user.createdAt);
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let arch = os.arch();
        let platform = os.platform();
        let NodeVersion = process.version;
        let cores = os.cpus().length;
        return message.channel.send(client.createEmbed()
            .setTitle(`${client.profileEmoji} ${client.user.username}`)
            .setDescription(`${client.user} is a multipurpose bot! This bot includes an moderation system up to an ticket system and giveaway system!
            [Add Galaxy Alpha](${client.inviteLink})
            [Visit Website](https://dev-galaxy-alpha.pantheonsite.io)
            ${message.guild.id == client.supportGuildID ? "" : "[Join Support Server](https://discord.gg/FkfYrR9JVp)\n"}`)
            .addField(`📊 Statistics of ${client.user.username}`, `🗓️ **Created at:** ${weekDays[dateMonthWeek.getUTCDay()]}, ${monthNames[dateMonthWeek.getUTCMonth()]} ${dateMonthWeek.getUTCDate()}, ${dateMonthWeek.getUTCFullYear()}, ${dateMonthWeek.getUTCHours()}:${dateMonthWeek.getUTCMinutes()}:${dateMonthWeek.getUTCSeconds()} UTC
            <a:protected:786707379470598174> **Servers Cache Count:** ${client.guilds.cache.size}
            ${client.memberEmoji} **Users Cache Count:** ${client.users.cache.size}
            📰 **Channels Cache Count:** ${client.channels.cache.size}
            <:desktop_dev:786332949226323988> **Platform:** ${platform}
            ${client.workingGearEmoji} **Architecture:** ${arch}
            🟢 **node.js-Version:** ${NodeVersion}
            🎛️ **${client.ws.shards.size == 1 ? "Shard" : "Shards"}:** ${client.ws.shards.size}
            💾 **Cores:** ${cores}`)
            .addField(`💎 ${client.user.username} Premium`, "This feature will come in the future!")
            .setThumbnail(client.user.displayAvatarURL()));
    };
};