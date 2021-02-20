import Command, { CommandRunner } from '@root/Command';
import { Role } from 'discord.js';

export default class GiveawayManagerRoleCommand extends Command {
    constructor(){
        super({
            name: "giveawaymanager",
            description: "giveawaymanager role commands",
            category: "management",
            usage: "giveawaymanager set <@Role/Role ID> or giveawaymanager remove",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"]
        });
    };  
    run: CommandRunner = async (client, message, args, prefix) => {
        const giveawayManager = "🎉 Giveaway Manager Role Manager";
        const guildSettings = await client.cache.getGuild(message.guild.id);
        if (args[0]?.toLowerCase() == "set") {
            let role: Role;
            if (message.mentions.roles.first() && message.guild.roles.cache.has(message.mentions.roles.first().id)) role = message.mentions.roles.first();
            if (args[1] && message.guild.roles.cache.has(args[1])) role = message.guild.roles.cache.get(args[1]);
            if (!role) return client.createArgumentError(message, { title: giveawayManager, description: "You have to mention a role or provide a role ID!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(giveawayManager)
                .setDescription(`Do you really want to change the current giveaway manager role to ${role}?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    await client.cache.updateGuild(message.guild.id, {
                        giveawayManagerRoleID: role.id
                    });
                    return client.createSuccess(message, { title: giveawayManager, description: `Set the new giveaway manager role to ${role}` });
                } else return client.createArgumentError(message, { title: giveawayManager, description: "Setting giveaway manager role cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: giveawayManager, description: "Setting giveaway manager role cancelled!" }, this.usage);
            });
        } else if (args[0]?.toLowerCase() == "remove") {
            if (!guildSettings.giveawayManagerRoleID) return client.createArgumentError(message, { title: giveawayManager, description: "There is no giveaway manager role to remove!" }, this.usage);
            const msg = await message.channel.send(client.createEmbed()
                .setTitle(giveawayManager)
                .setDescription(`Do you really want to remove the current giveaway manager role?\n\nYou have 30s to react!`));
            await msg.react(client.yesEmojiID);
            await msg.react(client.noEmojiID);
            const YesOrNo = msg.createReactionCollector((reaction, user) => user.id == message.author.id && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1, time: 30000 });
            YesOrNo.on("collect", async (reaction, user) => {
                if (reaction.emoji.id == client.yesEmojiID) {
                    await client.cache.updateGuild(message.guild.id, {
                        giveawayManagerRoleID: null
                    });
                    return client.createSuccess(message, { title: giveawayManager, description: `Removed the current giveaway manager role!` });
                } else return client.createArgumentError(message, { title: giveawayManager, description: "Removing giveaway manager role cancelled!" }, this.usage);
            });
            YesOrNo.on("end", (collected, reason) => {
                if (collected.size == 0) return client.createArgumentError(message, { title: giveawayManager, description: "Removing giveaway manager role cancelled!" }, this.usage);
            });
        } else {
            return client.createEmbedForSubCommands(message, {
                title: giveawayManager,
                description: "Use this commands to set or remove the giveaway manager role!"
            }, [{
                usage: "giveawaymanager set <@Role/Role ID>",
                description: "Sets the giveaway manager role"
            }, {
                usage: "giveawaymanager remove",
                description: "Removes the giveaway manager role"
            }]);
        };
    };
};