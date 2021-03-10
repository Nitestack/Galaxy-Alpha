import Command, { CommandRunner } from '@root/Command';
import { Role } from 'discord.js';

export default class BlackListRoleCommand extends Command {
    constructor() {
        super({
            name: "blacklistrole",
            description: "blacklist role commands",
            guildOnly: true,
            category: "management",
            usage: "blacklistrole set <@Role/Role ID> or blacklistrole remove",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const blackListManager = "🚫 Giveaway Blacklist Role Manager";
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (args[0]?.toLowerCase() == "set") {
            let role: Role;
            if (message.mentions.roles.first() && message.guild.roles.cache.has(message.mentions.roles.first().id)) role = message.mentions.roles.first();
            if (args[1] && message.guild.roles.cache.has(args[1])) role = message.guild.roles.cache.get(args[1]);
            if (!role) return client.createArgumentError(message, { title: blackListManager, description: "You have to mention a role or provide a role ID!" }, this.usage);
            client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
                .setTitle(blackListManager)
                .setDescription(`Do you really want to change the current giveaway blacklist role to ${role}?\n\nYou have 30s to react!`)), {
                title: blackListManager,
                activity: "setting",
                toHandle: "giveaway blacklist role"
            }, this.usage, async (reaction, user) => {
                await client.cache.updateGuild(message.guild.id, {
                    giveawayBlacklistedRoleID: role.id
                });
                return client.createSuccess(message, { title: blackListManager, description: `Set the new giveaway blacklist role to ${role}` });
            });
        } else if (args[0]?.toLowerCase() == "remove") {
            if (!guildSettings.giveawayBlacklistedRoleID) return client.createArgumentError(message, { title: blackListManager, description: "There is no giveaway blacklist role to remove!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(blackListManager)
                .setDescription(`Do you really want to remove the current giveaway blacklist role?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
                .setTitle(blackListManager)
                .setDescription(`Do you really want to remove the current giveaway blacklist role?\n\nYou have 30s to react!`)), {
                title: blackListManager,
                activity: "removing",
                toHandle: "giveaway blacklist role"
            }, this.usage, async (reaction, user) => {
                await client.cache.updateGuild(message.guild.id, {
                    giveawayBlacklistedRoleID: null
                });
                return client.createSuccess(message, { title: blackListManager, description: `Removed the current giveaway blacklist role!` });
            });
        } else {
            return client.createEmbedForSubCommands(message, {
                title: blackListManager,
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