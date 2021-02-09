import Command, { CommandRunner } from "@root/Command";

export default class ReminderCommand extends Command {
    constructor(){
        super({
            name: "reminder",
            category: "utility",
            description: "set's a reminder",
            usage: "reminder <duration> [reminder text]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const duration = args[0];
        if (!duration || !client.ms(duration)) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("Reminder Manager")
            .setDescription("You have to provide a valid duration!"));
        const reminderText = args.slice(1).join(" ") || "No reminder text provided!";
        message.channel.send(client.createGreenEmbed()
            .setTitle("Reminder Manager")
            .setDescription(`You set a reminder for **${duration}**!`));
        setTimeout(() => {
            return message.author.send(client.createEmbed()
                .setTitle("Reminder")
                .setDescription(`🕐 You set a reminder for **${duration}**!\n🗓️ **Reminder created at:** ${client.util.weekDays[message.createdAt.getUTCDay()]}, ${client.util.monthNames[message.createdAt.getUTCMonth()]} ${message.createdAt.getUTCDate()}, ${message.createdAt.getUTCFullYear()}, ${message.createdAt.getUTCHours()}:${message.createdAt.getUTCMinutes()}:${message.createdAt.getUTCSeconds()} UTC\n📝 \`${reminderText}\``));
        }, client.ms(duration));
    }; 
};