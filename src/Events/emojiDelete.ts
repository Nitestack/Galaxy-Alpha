import Event, { EventRunner } from "@root/Event";
import { GuildEmoji } from "discord.js";

export default class EmojiDeleteEvent extends Event {
    constructor(){
        super({
            name: "emojiDelete"
        });
    };
    run: EventRunner = async (client, emoji: GuildEmoji) => {
        await client.modLogWebhook(emoji.guild.id, client.createRedEmbed()
            .setTitle("Emoji Deleted!")
            .setDescription(`**Name:** *${emoji.name}*
            **Created At:** *${client.util.dateFormatter(emoji.createdAt)}*
            **Emoji:** ${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`}`));
        const guildSettings = await client.cache.getGuild(emoji.guild.id);
        for (const reactionRole of guildSettings.reactionRoles){
            if (Object.values(reactionRole).includes(emoji.createdTimestamp ? reactionRole.emojiID : emoji.name.toString())){
            };
        };
    };
};