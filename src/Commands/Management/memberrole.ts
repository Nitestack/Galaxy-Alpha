import Command, { CommandRunner } from '@root/Command';
import { Role } from 'discord.js';

export default class MemberRoleCommand extends Command {
    constructor(){
        super({
            name: "memberrole",
            description: "member role commands",
            usage: "memberrole set <@Role/Role ID> or memberrole remove",
            category: "management",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const memberRoleManager = "🚫 Giveaway Blacklist Role Manager";
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (args[0]?.toLowerCase() == "set") {
            let role: Role;
            if (message.mentions.roles.first() && message.guild.roles.cache.has(message.mentions.roles.first().id)) role = message.mentions.roles.first();
            if (args[1] && message.guild.roles.cache.has(args[1])) role = message.guild.roles.cache.get(args[1]);
            if (!role) return client.createArgumentError(message, { title: memberRoleManager, description: "You have to mention a role or provide a role ID!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(memberRoleManager)
                .setDescription(`Do you really want to change the current giveaway blacklist role to ${role}?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    client.cache.guilds.set(message.guild.id, {
                        ...guildSettings,
                        giveawayBlacklistedRoleID: role.id
                    });
                    return client.createSuccess(message, { title: memberRoleManager, description: `Set the new giveaway blacklist role to ${role}` });
                } else return client.createArgumentError(message, { title: memberRoleManager, description: "Setting giveaway blacklist role cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: memberRoleManager, description: "Setting giveaway blacklist role cancelled!" }, this.usage);
            });
        } else if (args[0]?.toLowerCase() == "remove") {
            if (!guildSettings.giveawayBlacklistedRoleID) return client.createArgumentError(message, { title: memberRoleManager, description: "There is no giveaway blacklist role to remove!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(memberRoleManager)
                .setDescription(`Do you really want to remove the current giveaway blacklist role?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    client.cache.guilds.set(message.guild.id, {
                        ...guildSettings,
                        giveawayBlacklistedRoleID: null
                    });
                    return client.createSuccess(message, { title: memberRoleManager, description: `Removed the current giveaway blacklist role!` });
                } else return client.createArgumentError(message, { title: memberRoleManager, description: "Removing giveaway blacklist role cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: memberRoleManager, description: "Removing giveaway blacklist role cancelled!" }, this.usage);
            });
        } else {
            return client.createEmbedForSubCommands(message, {
                title: memberRoleManager,
                description: "Use this commands to set or remove the giveaway blacklist role!"
            }, [{
                usage: "blacklistrole set <@Role/Role ID>",
                description: "Sets the giveaway blacklist role"
            }, {
                usage: "blacklistrole remove",
                description: "Removes the giveaway blacklist role"
            }]);
        };
    };
};