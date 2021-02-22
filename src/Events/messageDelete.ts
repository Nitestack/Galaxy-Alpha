import Event, { EventRunner } from '@root/Event';
import { Message } from 'discord.js';
import GiveawaySchema from '@models/Giveaways/giveaways';
import DropSchema from '@models/Giveaways/drops';
import { Guild } from "@models/guild";

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
        const giveaway = await GiveawaySchema.findOne({ messageID: message.id });
        if (giveaway) await GiveawaySchema.findOneAndDelete({ messageID: message.id });
        const dropSchema = await DropSchema.findOne({ messageID: message.id });
        if (dropSchema) await DropSchema.findOneAndDelete({ messageID: message.id });
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (guildSettings.modLogChannelID == message.channel.id) return;
        await client.modLogWebhook(message.guild.id, client.createRedEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle("Message Deleted!")
            .setDescription(`**Author:** ${message.author}
            **Created At:** *${client.util.dateFormatter(message.createdAt)}*
            **Content** *${message.embeds[0] ? message.embeds[0].description : message.content}*`));
        if (!guildSettings.reactionRoles) return;
        const results = guildSettings.reactionRoles.filter(reactionrole => reactionrole.messageID == message.id);
        if (results.length != 0) {
            const newReactionRoles = guildSettings.reactionRoles;
            results.forEach(reactionrole => {
                newReactionRoles.splice(newReactionRoles.indexOf(reactionrole), 1);
            });
            client.cache.guilds.set(message.guild.id, ({
                ...guildSettings,
                reactionRoles: newReactionRoles
            } as Guild));
        };
    };
};