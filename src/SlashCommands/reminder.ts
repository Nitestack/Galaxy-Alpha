import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";

export default class ReminderSlashCommand extends SlashCommand {
    constructor() {
        super({
            name: "reminder",
            description: "Remindes you on something",
            type: "message",
            options: [{
                name: "duration",
                type: 3,
                description: "The time",
                required: true
            }, {
                name: "text",
                type: 3,
                description: "The text to remind",
                required: false
            }]
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
        const reminderText = args.text || "No reminder text provided!";
        this.data.embeds = client.createGreenEmbed()
            .setTitle("Reminder Manager")
            .setDescription(`You set a reminder for **${args.duration}**!`);
        setTimeout(() => {
            return infos.member.send(client.createEmbed()
                .setTitle("Reminder")
                .setDescription(`🕐 You set a reminder for **${args.duration}**!\n🗓️ **Reminder created at:** ${client.util.dateFormatter(Date.now())}\n📝 \`${reminderText}\``));
        }, client.ms(args.duration));
    };
};
