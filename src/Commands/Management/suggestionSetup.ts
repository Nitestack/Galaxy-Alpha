import Command, { CommandRunner } from "@root/Command";
import { Role } from "discord.js"; 

export default class extends Command {
    constructor() {
        super({
            name: "suggestion-setup",
            description: "runs the suggestion setup",
            category: "management",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args: Array<string>, prefix) => {
        const responses: {
            channelID: string,
            managerRoleID: string
        } = {
            channelID: null,
            managerRoleID: null
        };
        client.util.prompts(`${client.developerToolsEmoji} Suggestion Setup`, [{
            title: "#1 Suggestion Channel",
            description: "Please mention a channel or provide a channel ID! Type `create` to let me create one!",
            errorText: "Invalid channel or channel ID!",
            checkFunction: async (i, msg) => {
                if (msg.content.toLowerCase() == "create" && message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                    const categoryChannel = await message.guild.channels.create("suggestions", {
                        type: "text"
                    });
                    responses.channelID = categoryChannel.id;
                } else {
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) responses.channelID = msg.mentions.channels.first().id;
                    else if (message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(msg.content)) responses.channelID = msg.content;
                };
                if (!responses.channelID) return false;
                return true;
            }
        }, {
            title: "#2 Suggestion Manager",
            description: "Please mention a role or provide a role ID! Type `create` to let me create one!",
            errorText: "Invalid role or role ID!",
            checkFunction: async (i, msg) => {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "Suggestion Manager",
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first()) role = msg.mentions.roles.first();
                    else if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) {
                    responses.managerRoleID = role.id;
                    return true;
                } else return false;
            }
        }], message.channel, (m) => m.author.id == message.author.id, {
            description: "Cancelled suggestion setup!",
            commandUsage: this.usage
        }, async () => {
            await client.cache.updateGuild(message.guild.id, {
                suggestion: responses
            });
            return client.createSuccess(message, { title: `${client.developerToolsEmoji} Suggestion Setup`, description: "Successfully completed suggestion setup!" });
        }, true);
    };
};