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
        const prompts = [
            `I cannot find this user! The user has to turned on "allow direct messages from server" and has to be in a server, where ${client.user.username} is also in!`,
            'You have to answer with `yes` or `no`!\nShould be the message an embed?',
            'Who do you want to send the message to?\nMention a user or provide a user id into this channel!',
            'Should be the message an embed? Answer with yes or no!',
            'What is the message, you want to send to the user?',
        ];
        let responses: {
            user: User,
            embed: "yes" | "no",
            messageContent: StringResolvable
        } = {
            user: null,
            embed: "no",
            messageContent: ""
        };
        for (let i = 2; i < prompts.length; i++) {
            if (i <= 1) client.createArgumentError(message, { title: "DM Manager", description: prompts[i] }, this.usage);
            if (i >= 2) message.channel.send(client.createEmbed().setTitle("DM Manager").setDescription(`${prompts[i]}\n\n**How to cancel?**\nSimply type \`cancel\` to cancel the process!`));
            const response = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1 });
            const { content } = response.first();
            if (content.toLowerCase() == 'cancel') return client.createArgumentError(message, { title: "DM Manager", description: "DM cancelled!" }, this.usage);
            if (i == 0) {
                let user: User;
                if (response.first().mentions.users.first() && client.users.cache.filter(user => !user.bot).has(response.first().mentions.users.first().id)) user = client.users.cache.get(response.first().mentions.users.first().id);
                if (response.first().content && client.users.cache.filter(user => !user.bot).has(response.first().content)) user = client.users.cache.get(response.first().content);
                if (user) {
                    responses.user = user;
                    i = 2;
                } else i = -1;
            } else if (i == 1) {
                if (content.toLowerCase() == 'yes' || content.toLowerCase() == 'no') {
                    responses.embed = (content.toLowerCase() as "yes" | "no");
                    i = 3;
                } else i = 0;
            } else if (i == 2) {
                let user: User;
                if (response.first().mentions.users.first() && client.users.cache.filter(user => !user.bot).has(response.first().mentions.users.first().id)) user = client.users.cache.get(response.first().mentions.users.first().id);
                if (response.first().content && client.users.cache.filter(user => !user.bot).has(response.first().content)) user = client.users.cache.get(response.first().content);
                if (user) responses.user = user;
                else i = -1;
            } else if (i == 3) {
                if (content.toLowerCase() == 'yes' || content.toLowerCase() == 'no') responses.embed = (content.toLowerCase() as "yes" | "no");
                else i = 0;
            } else responses.messageContent = content;
        };
        if (responses.embed == 'yes') {
            const content = responses.messageContent;
            return responses.user.send(client.createEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(content)).then(msg => {
                    return client.createSuccess(message, { title: "DM Manager", description: `You successfully sent a embed message with the content\n\`${content}\`\nto ${responses.user}!` });
                });
        } else {
            const content = responses.messageContent;
            return responses.user.send(`${content}\n\n*Sent by ${message.author}*`).then(msg => {
                return client.createSuccess(message, { title: "DM Manager", description: `You successfully sent a message with the content\n\`${content}\`\nto ${responses.user}!` });
            });
        };
    };
};