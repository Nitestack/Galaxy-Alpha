import Command, { CommandRunner } from "@root/Command";
import { NewsChannel, Role, TextChannel } from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "giveaway-setup",
            description: "runs the giveaway setup",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const responses: {
            managerRoleID: string,
            blacklistRoleID: string | "none",
            logChannelID: string | "none",
            bypassRoleID: string | "none"
        } = {
            managerRoleID: null,
            blacklistRoleID: null,
            logChannelID: null,
            bypassRoleID: null
        };
        await client.util.prompts("🎉 Giveaway Setup", [{
            title: "#1 Giveaway Manager Role",
            description: "Please mention a role or provide a role ID! Type `create` to let me create one!",
            errorText: "Invalid role or role ID!",
            checkFunction: async (i, msg) => {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "Giveaway Manager",
                            permissions: []
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first() && message.guild.roles.cache.has(msg.mentions.roles.first().id)) role = msg.mentions.roles.first();
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) {
                    responses.blacklistRoleID = role.id;
                    return true;
                } else return false;
            }
        }, {
            title: "#2 Giveaway Blacklist Role",
            description: "Please mention a role or provide a role ID! Type `create` to let me create one!",
            errorText: "Invalid role or role ID!",
            checkFunction: async (i, msg) => {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "Giveaway Blacklist",
                            permissions: []
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first() && message.guild.roles.cache.has(msg.mentions.roles.first().id)) role = msg.mentions.roles.first();
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) {
                    responses.blacklistRoleID = role.id;
                    return true;
                } else return false;
            }
        }, {
            title: "#3 Giveaway Bypass Role",
            description: "Please mention a channel or provide a channel ID! Type `create` to let me create one!",
            errorText: "Invalid channel or channel ID!",
            checkFunction: async (i, msg) => {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "Giveaway Bypass",
                            permissions: []
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first() && message.guild.roles.cache.has(msg.mentions.roles.first().id)) role = msg.mentions.roles.first();
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) {
                    responses.bypassRoleID = role.id;
                    return true;
                } else return false;
            }
        }, {
            title: "#4 Giveaway Log Channel",
            description: "Please mention a channel or provide a channel ID! Type `create` to let me create one!",
            errorText: "Invalid channel or channel ID!",
            checkFunction: (i, msg) => {
                let channel: TextChannel | NewsChannel;
                if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) channel = msg.mentions.channels.first();
                else if (message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(msg.content)) channel = message.guild.channels.cache.get(msg.content) as TextChannel | NewsChannel;
                if (channel) {
                    responses.logChannelID = channel.id;
                    return true;
                } else return false;
            }
        }], message.channel, (m) => m.author.id == message.author.id, {
            description: "Cancelled giveaway setup!",
            commandUsage: this.usage,
            manager: "🎉 Giveaway Setup Manager"
        }, async () => {
            await client.cache.updateGuild(message.guild.id, {
                giveawayBlacklistedRoleID: responses.blacklistRoleID,
                giveawayByPassRoleID: responses.bypassRoleID,
                giveawayManagerRoleID: responses.managerRoleID
            });
            return client.createSuccess(message, { title: "🎉 Giveaway Setup Manager", description: "Completed giveaway setup!" });
        }, true);
    };
};