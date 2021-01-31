//12 OBJECT ERRORS
import Command from '@root/Command';
import { User } from 'discord.js';

module.exports = class DMCommand extends Command {
    constructor(client){
        super(client, {
            name: "dm",
            description: "dm's an user",
            category: "miscellaneous",
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        const textEmbed = client.createEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle('DM Manager');

        const sentEmbed = client.createGreenEmbed()
            .setTitle('DM Manager');

        const prompts = [
            'I cannot find this user! The user has to turned on "allow direct messages from server responses.users" and has to be in a server, where Galaxy Alpha is also in!',
            'You have to answer with `yes` or `no`!\nShould be the message an embed?',
            'Who do you want to send the message to?\nMention a user, provide a user id or just type the name of the user into this channel (no nicknames)!',
            'Should be the message an embed? Answer with yes or no!',
            'What is the message, you want to send to the user?',
        ];
        let responses: object = {};
        for (let i = 2; i < prompts.length; i++) {
            const embed = client.createEmbed()
                .setTitle('DM Manager')
                .setDescription(`${prompts[i]}`).addField("How to cancel?", "Simply type `cancel` to cancel the process");
            await message.channel.send(embed);
            const response = await message.channel.awaitMessages(
                m => m.author.id === message.author.id,
                { max: 1 }
            );
            const { content } = response.first();
            if (content.toLowerCase() == 'cancel') return message.channel.send(client.createEmbed(true, `${prefix}dm`).setTitle('DM Manager').setDescription("DMing cancelled!"));
            if (i == 0) {
                let user: User;
                if (response.first().mentions.users.first()) user = client.users.cache.filter(user => !user.bot).get(response.first().mentions.users.first().id);
                if (response.first() && client.users.cache.filter(user => !user.bot).get(response.first().content))
                    if (user) {
                        responses.user = user;
                        i = 2;
                    } else {
                        i = -1;
                    };
            } else if (i == 1) {
                if (content) {
                    responses.embed = content;
                    i = 3;
                } else {
                    i = 0;
                };
            } else if (i == 2) {
                let user: User;
                if (response.first().mentions.users.first()) user = client.users.cache.get(response.first().mentions.users.first().id);
                if (response.first().content && client.users.cache.get(response.first().content)) user = client.users.cache.get(response.first().content);
                if (user) {
                    responses.user = user;
                    i = 2;
                } else {
                    i = -1;
                };
            } else if (i == 3) {
                if (content.toLowerCase() == 'yes' || content.toLowerCase() == 'no') {
                    responses.embed = content.toLowerCase();
                } else {
                    i = 0;
                };
            } else {
                responses.messageContent = content;
            };
        };
        if (responses.embed == 'yes') {
            const content = responses.messageContent;
            textEmbed.setDescription(`${content}
            
            **Sent by ${message.author} from \`${message.guild.name}\`**`);
            return responses.user.send(textEmbed).then((msg) => {
                sentEmbed.setDescription(
                    `You successfully sent a embed message with the content\n\`${content}\`\nto ${responses.user}!`
                );
                return message.channel.send(sentEmbed);
            });
        } else {
            const content = responses.messageContent;
            return responses.user.send(`${content}\n\n**Sent by ${message.author} from \`${message.guild.name}\`**`).then((msg) => {
                sentEmbed.setDescription(`You successfully sent a message with the content\n\`${content}\`\nto ${responses.user}!`);
                return message.channel.send(sentEmbed);
            });
        };
    };
};