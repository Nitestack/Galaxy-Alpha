import Command, { CommandRunner } from "@root/Command";
import { CategoryChannel, NewsChannel, Role, TextChannel } from "discord.js";

export default class extends Command {
    constructor() {
        super({
            name: "application-setup",
            description: "runs the application setup",
            category: "management"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const responses: {
            categoryID: string,
            logChannelID: string,
            questions: Array<string>,
            managerRoleID: string
        } = {
            categoryID: null,
            logChannelID: null,
            questions: null,
            managerRoleID: null
        }
        client.util.prompts("📝 Application Setup", [{
            title: "#1 Application Category",
            description: "Please provide a category ID or type `create` to let me create one!",
            errorText: "Invalid category ID!",
            checkFunction: async (i, msg) => {
                let category: CategoryChannel;
                if (msg.content.toLowerCase() == "create") {
                    const newChannel = await message.guild.channels.create("Applications", {
                        type: "category"
                    });
                    category = newChannel;
                } else if (message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "news").has(msg.content)) category = message.guild.channels.cache.get(msg.content) as CategoryChannel;
                if (category) {
                    responses.categoryID = category.id;
                    return true;
                } else return false;
            }
        }, {
            title: "#2 Application Log Channel",
            description: "Please mention a channel or provide a channel ID! Type `create` to let me create one!",
            errorText: "Invalid channel or channel ID!",
            checkFunction: async (i, msg) => {
                let channel: TextChannel | NewsChannel;
                if (msg.content.toLowerCase() == "create") {
                    const newChannel = await message.guild.channels.create("application-log", {
                        type: "text"
                    });
                    channel = newChannel;
                } else {
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) channel = msg.mentions.channels.first();
                    else if (message.guild.channels.cache.filter(c => c.type == "text" || c.type == "news").has(msg.content)) channel = message.guild.channels.cache.get(msg.content) as TextChannel | NewsChannel;
                };
                if (channel) {
                    responses.logChannelID = channel.id;
                    return true;
                } else return false;
            }
        }, {
            title: "#3 Application Manager Role",
            description: "Please mention a role or provide a role ID! Type `create` to let me create one!",
            errorText: "Invalid role or role ID!",
            checkFunction: async (i, msg) => {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "Application Manager"
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first() && message.guild.roles.cache.has(msg.mentions.roles.first().id)) role = msg.mentions.roles.first();
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) {
                    responses.managerRoleID = role.id;
                    return true;
                } else return true;
            }
        }, {
            title: "#4 Application Questions",
            description: "Please provide questions! Trim each question with an `|`!",
            errorText: "An error occurred!",
            checkFunction: (i, msg) => {
                const questions = msg.content.split(/\|/g);
                responses.questions = questions;
                return true;
            }
        }], message.channel, (m) => m.author.id == message.author.id, {
            description: "Cancelled application setup!",
            commandUsage: this.usage
        }, async () => {
            const categoryChannel = message.guild.channels.cache.get(responses.categoryID) as CategoryChannel;
            await categoryChannel.updateOverwrite(responses.managerRoleID, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            });
            await categoryChannel.updateOverwrite(message.guild.id, {
                VIEW_CHANNEL: false
            });
            await client.cache.updateGuild(message.guild.id, {
                application: responses
            });
        }, true);
    };
};