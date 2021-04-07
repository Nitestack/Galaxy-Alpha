import Command, { CommandRunner } from "@root/Command";
import { Message } from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "apply",
            aliases: ["application"],
            description: "starts an application",
            category: "utility"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (!guildSettings.application.categoryID || !guildSettings.application.managerRoleID || !guildSettings.application.managerRoleID || guildSettings.application.questions.length < 1) return client.createArgumentError(message, { title: "📝 Application Manager", description: "This server has to run the `application-setup` command!" }, this.usage);
        const newArray = [];
        const responses: Array<string> = [];
        for (let i = 0; i < guildSettings.application.questions.length; i++) {
            const newArrayItem = {
                title: `#${i + 1} Question`,
                description: guildSettings.application.questions[i],
                errorText: "An error occurred!",
                checkFunction: (i: number, msg: Message) => {
                    responses.push(msg.content);
                    return true;
                }
            };
            newArray.push(newArrayItem);
        };
        client.util.prompts(`📝 Application of ${message.guild.name}`, newArray, message.author.dmChannel, (m) => m.author.id == message.author.id, {
            description: "Cancelled application!",
            commandUsage: this.usage,
            manager: "📝 Application Manager"
        }, async () => {
            const toSendArray: Array<{
                question: string,
                answer: string
            }> = [];
            for (let i = 0; i < guildSettings.application.questions.length; i++) toSendArray.push({
                question: `#${i + 1} ${guildSettings.application.questions[i]}`,
                answer: responses[i]
            });
            const channel = message.guild.channels.cache.get(guildSettings.application.categoryID);
            const newChannel = await message.guild.channels.create(`app-${message.author.username}`, {
                type: "text",
                parent: channel.id
            });
            await newChannel.send(client.createEmbed()
                .setTitle("📝 Application")
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`A new application was created by ${message.author}!`));
            for (const app of toSendArray) await newChannel.send(client.createEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(app.question)
                .setDescription(app.answer));
            return client.createSuccess(message, { title: "📝 Application Manager", description: "Your application was successfully submitted!" });
        }, true);
    };
};