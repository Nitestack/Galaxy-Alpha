import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

export default class DMSuggestionCommand extends Command {
    constructor() {
        super({
            name: "dmsuggestion",
            description: "DM's an user",
            category: "developer",
            usage: "dmsuggestion <@User/User ID> <title> <response>",
            developerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let user: User;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) user = client.users.cache.get(message.mentions.users.first().id);
        if (args[0] && client.users.cache.has(args[0])) user = client.users.cache.get(args[0]);
        if (!user) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("DM Manager")
            .setDescription("You have to mention an user or provide an user ID!"));
        if (!args[1]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("DM Manager")
            .setDescription("You have to provide a title for the embed!"));
        if (!args[2]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)!!
            .setTitle("DM Manager")
            .setDescription("You have to provide a description for the embed!"));
        return user.send(client.createEmbed()
            .setTitle(args[1])
            .setDescription(args.slice(2).join(" "))
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))).then(msg => {
                return message.channel.send(client.createGreenEmbed()
                    .setTitle("DM Manager")
                    .setDescription(`Successfully sent ${user} the embed with the title \`${args[1]}\` and the description\n\`${args.slice(2).join(" ")}\``));
            });
    };
};