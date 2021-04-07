import Command, { CommandRunner } from '@root/Command';
import { StringResolvable, User } from 'discord.js';

export default class DMCommand extends Command {
    constructor() {
        super({
            name: "dm",
            description: "dm's an user",
            category: "developer",
            developerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const responses: {
            user: User,
            embed: "yes" | "no",
            messageContent: StringResolvable
        } = {
            user: null,
            embed: "no",
            messageContent: ""
        };
        client.util.prompts("📝 Direct Message", [{
            title: "#1 DM User",
            description: "Please mention a user or provide an user ID!",
            errorText: "Invalid user or user ID!",
            checkFunction: (i, msg) => {
                let user: User;
                if (msg.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(msg.mentions.users.first().id)) user = msg.mentions.users.first();
                else if (client.users.cache.filter(user => !user.bot).has(msg.content)) user = client.users.cache.get(msg.content);
                if (user) {
                    responses.user = user;
                    return true;
                } else return false;
            }
        }, {
            title: "#2 DM Embed",
            description: "Please answer with `yes` or `no`, if you want an embed!",
            errorText: "Invalid response!",
            checkFunction: (i, msg) => {
                if (msg.content.toLowerCase() == "yes") {
                    responses.embed = "yes";
                } else if (msg.content.toLowerCase() == "no") {
                    responses.embed = "no";
                } else return false;
            }
        }, {
            title: "#3 DM Content",
            description: "Please provide a content to send to the user!",
            errorText: "Unknown error occurred!",
            checkFunction: (i, msg) => {
                responses.messageContent = msg.content;
                return true;
            }
        }], message.channel, (m) => m.author.id == message.author.id, {
            description: "Cancelled direct messaging user!",
            commandUsage: this.usage
        }, async () => {
            if (responses.embed == 'yes') {
                await responses.user.send(client.createEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(responses.messageContent));
                return client.createSuccess(message, { title: "DM Manager", description: `You successfully sent a embed message to ${responses.user}!` });
            } else {
                await responses.user.send(`${responses.messageContent}\n\n*Sent by ${message.author}*`);
                return client.createSuccess(message, { title: "DM Manager", description: `You successfully sent a message to ${responses.user}!` });
            };
        }, true);
    };
};