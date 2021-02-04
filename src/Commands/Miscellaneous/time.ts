import Command from '@root/Command';

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
            .setDescription(`**${client.util.weekDays[dateMonthWeek.getUTCDay()]}, ${client.util.monthNames[dateMonthWeek.getUTCMonth()]} ${dateMonthWeek.getUTCDate()}, ${dateMonthWeek.getUTCFullYear()}, ${dateMonthWeek.getUTCHours()}:${dateMonthWeek.getUTCMinutes()}:${dateMonthWeek.getUTCSeconds()} UTC**`));
    };
};