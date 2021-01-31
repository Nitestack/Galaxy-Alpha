import Command from '@root/Command';
import { weekDays, monthNames } from "@root/util";

module.exports = class TimeCommand extends Command {
    constructor(client){
        super(client, {
            name: "time",
            description: "shows the current time",
            category: "miscellaneous"
        });
    };
    async run(client, message, args, prefix) {
        const dateMonthWeek = new Date(message.createdAt);
        return message.channel.send(client.createEmbed()
            .setTitle('🕑 Current Time')
            .setDescription(`**${weekDays[dateMonthWeek.getUTCDay()]}, ${monthNames[dateMonthWeek.getUTCMonth()]} ${dateMonthWeek.getUTCDate()}, ${dateMonthWeek.getUTCFullYear()}, ${dateMonthWeek.getUTCHours()}:${dateMonthWeek.getUTCMinutes()}:${dateMonthWeek.getUTCSeconds()} UTC**`));
    };
};