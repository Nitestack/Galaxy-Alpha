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
        return message.channel.send(client.createEmbed().setTitle(`📊 Statistics of ${client.user.username}`).setDescription(`🗓️ **Created at:** ${client.util.dateFormatter(client.user.createdAt)}
        <a:protected:786707379470598174> **Servers Cache Count:** ${client.guilds.cache.size}
        ${client.memberEmoji} **Users Cache Count:** ${client.users.cache.size}
        📰 **Channels Cache Count:** ${client.channels.cache.size}
        <:desktop_dev:786332949226323988> **Platform:** ${os.platform()}
        ${client.workingGearEmoji} **Architecture:** ${os.arch()}
        🟢 **nodeJS-Version:** ${process.version}
        🎛️ **Shards:** ${client.ws.shards.size}
        💾 **Cores:** ${os.cpus().length}
        🕐 **Uptime:** ${client.humanizer(client.uptime, {
            units: ["y", "mo", "w", "d", "h", "m", "s", "ms"],
            round: true
        })}`));
    };
};