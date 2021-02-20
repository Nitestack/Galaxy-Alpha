import Event, { EventRunner } from "@root/Event";
import { MessageReaction, User } from "discord.js";

export default class MessageReactionRemoveEvent extends Event {
    constructor() {
        super({
            name: "messageReactionRemove"
        });
    };
    run: EventRunner = async (client, reaction: MessageReaction, user: User) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;
        if (!reaction.message.guild.me.hasPermission("MANAGE_ROLES")) return;
        const guildSettings = await client.cache.getGuild(reaction.message.guild.id);
        if (!guildSettings || !guildSettings.reactionRoles) return;
        const reactions = guildSettings.reactionRoles.filter(reactionrole => reactionrole.messageID == reaction.message.id && (reaction.emoji.createdTimestamp ? reaction.emoji.id == reactionrole.emojiID : reaction.emoji.name.toString()) == reactionrole.emojiID);
        if (!reactions || reactions.length != 1) return;
        console.log("WOKRING")
        if (reaction.message.id == reactions[0].messageID) reaction.message.guild.members.cache.get(user.id).roles.remove(reactions[0].roleID);
    };
};