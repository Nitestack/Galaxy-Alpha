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
        return message.channel.send(client.createEmbed()
        .setTitle(`📊 Statistics of ${client.user.username}`)
        .addField("🗓️ Created at:", client.util.dateFormatter(client.user.createdAt))
        .addField(`${client.protectedEmoji} Server Count:`, client.guilds.cache.size)
        .addField(`${client.memberEmoji} Member Count:`, client.users.cache.size)
        .addField("📰 Channel Count:", client.channels.cache.size)
        .addField(`${client.workingGearEmoji} Platform:`, os.platform())
        .addField(`📚 Library:`, "discord.js")
        .addField("🟢 nodeJS Version:", process.version)
        .addField("🎛️ Shards:", client.ws.shards.size)
        .addField("🕐 Cores:", os.cpus().length)
        .addField("🕐 Uptime:", client.humanizer(client.uptime, {
            units: ["y", "mo", "w", "d", "h", "m", "s", "ms"],
            round: true
        })));
    };
};