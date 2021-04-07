import Command, { CommandRunner } from "@root/Command";
import { NewsChannel, Role, TextChannel, CategoryChannel } from "discord.js";

export default class ModMailSetupCommand extends Command {
    constructor() {
        super({
            name: "modmail-setup",
            description: "runs an interactive setup for modmail",
            category: "management",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const response: {
            categoryID: string,
            roleID: string,
            logChannelID: "none" | string
        } = {
            categoryID: null,
            roleID: null,
            logChannelID: null
        };
        client.util.prompts("📭 ModMail Setup", [{
            title: "#1 ModMail Category",
            description: "Please provide a category ID or type `create` to let me create a category channel!",
            errorText: "Invalid category ID!",
            checkFunction: async (i, msg) => {
                if (msg.content.toLowerCase() == "create" && message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                    const categoryChannel = await message.guild.channels.create("ModMail", {
                        type: "category"
                    });
                    response.categoryID = categoryChannel.id;
                } else if (message.guild.channels.cache.filter(channel => channel.type == "category").has(msg.content)) response.categoryID = msg.content;
                if (!response.categoryID) return false;
                return true;
            }
        }, {
            title: "#2 ModMail Manager Role",
            description: "Please mention a role or provide a role ID! Type `create` to let me create a role!",
            errorText: "Invalid role or role ID!",
            checkFunction: async (i, msg) => {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "ModMail Manager",
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first()) role = msg.mentions.roles.first();
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) response.roleID = role.id;
                if (!response.roleID) return false;
                return true;
            }
        }, {
            title: "#3 ModMail Log Channel",
            description: "Please mention a channel or provide a channel ID! If you don't want a log channel, type `none`. Type `create` to let me create one!",
            errorText: "Invalid channel or channel ID!",
            checkFunction: async (i, msg) => {
                let channel: TextChannel | NewsChannel;
                if (msg.content.toLowerCase() == "create") {
                    const newChannel = await message.guild.channels.create("modmail-log", {
                        type: "text",
                        parent: response.categoryID
                    });
                    channel = newChannel;
                } else if (msg.content.toLowerCase() == "none") {
                    response.logChannelID = "none";
                } else {
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) channel = msg.mentions.channels.first();
                    if (message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(msg.content)) channel = message.guild.channels.cache.get(msg.content) as TextChannel | NewsChannel;
                };
                if (channel) response.logChannelID = channel.id;
                if (!response.logChannelID) return false;
                return true;
            }
        }], message.channel, (m) => m.author.id == message.author.id, {
            description: "Cancelled modmail setup!",
            commandUsage: this.usage
        }, async () => {
            const categoryChannel = message.guild.channels.cache.get(response.categoryID) as CategoryChannel;
            await categoryChannel.updateOverwrite(response.roleID, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            });
            await categoryChannel.updateOverwrite(message.guild.id, {
                VIEW_CHANNEL: false
            });
            await client.cache.updateGuild(message.guild.id, {
                modMailManagerRoleID: response.roleID,
                modMailLogChannelID: response.logChannelID,
                modMailCategoryID: response.categoryID
            });
            return client.createSuccess(message, { title: "📭 ModMail Setup", description: "Sucessfully completed modmail setup!" });
        }, true);
    };
};