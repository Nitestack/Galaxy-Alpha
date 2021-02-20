import Event, { EventRunner } from "@root/Event";
import { GuildEmoji } from "discord.js";

export default class EmojiDeleteEvent extends Event {
    constructor(){
        super({
            name: "emojiDelete"
        });
    };
    run: EventRunner = async (client, emoji: GuildEmoji) => {
        const guildSettings = await client.cache.getGuild(emoji.guild.id);
    };
};