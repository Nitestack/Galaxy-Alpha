import Command, { CommandRunner } from "@root/Command";
import os from "os";

export default class StatsCommand extends Command {
    constructor() {
        super({
            name: "stats",
            description: "shows some stats of the bot",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const dateMonthWeek = new Date(client.user.createdAt);
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let arch = os.arch();
        let platform = os.platform();
        let NodeVersion = process.version;
        let cores = os.cpus().length;
        return message.channel.send(client.createEmbed().setTitle(`📊 Statistics of ${client.user.username}`).setDescription(`🗓️ **Created at:** ${weekDays[dateMonthWeek.getUTCDay()]}, ${monthNames[dateMonthWeek.getUTCMonth()]} ${dateMonthWeek.getUTCDate()}, ${dateMonthWeek.getUTCFullYear()}, ${dateMonthWeek.getUTCHours()}:${dateMonthWeek.getUTCMinutes()}:${dateMonthWeek.getUTCSeconds()} UTC
        <a:protected:786707379470598174> **Servers Cache Count:** ${client.guilds.cache.size}
        ${client.memberEmoji} **Users Cache Count:** ${client.users.cache.size}
        📰 **Channels Cache Count:** ${client.channels.cache.size}
        <:desktop_dev:786332949226323988> **Platform:** ${platform}
        ${client.workingGearEmoji} **Architecture:** ${arch}
        🟢 **node.js-Version:** ${NodeVersion}
        🎛️ **${client.ws.shards.size == 1 ? "Shard" : "Shards"}:** ${client.ws.shards.size}
        💾 **Cores:** ${cores}
        🕐 **Uptime:** ${client.humanizer(process.uptime() * 1000, {
            units: ["y", "mo", "w", "d", "h", "m", "s", "ms"],
            round: true
        })}`));
    };
};