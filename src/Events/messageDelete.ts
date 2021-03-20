import Event, { EventRunner } from '@root/Event';
import { Message } from 'discord.js';

export default class MessageDeleteEvent extends Event {
    constructor() {
        super({
            name: "messageDelete"
        });
    };
    run: EventRunner = async (client, message: Message) => {
        if (message.embeds.length == 0) client.snipes.set(message.channel.id, message);
        if (!message.guild) return;
        if (message.mentions.roles.first()) client.ghostPings.set(message.channel.id, message);
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (guildSettings.modLogChannelID == message.channel.id) return;
        await client.modLogWebhook(message.guild.id, client.createRedEmbed()
            .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle("Message Deleted!")
            .setDescription(client.util.embedFormatter.description(`**Author:** ${message.author}
            **Created At:** *${client.util.dateFormatter(message.createdAt)}*
            **Content** *${message.embeds[0] ? message.embeds[0].description : message.content}*`)));
    };
};