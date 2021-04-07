import Command, { CommandRunner } from "@root/Command";
import { CategoryChannel, Role } from "discord.js";

export default class TicketSetupCommand extends Command {
    constructor() {
        super({
            name: "ticket-setup",
            description: "runs the ticket setup",
            category: "management",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const responses: {
            categoryID: string,
            managerRoleID: string
        } = {
            categoryID: null,
            managerRoleID: null
        };
        client.util.prompts("🎫 Ticket Setup", [{
            title: "#1 Ticket Category",
            description: "Please provide a category ID or type `create` to let me create one!",
            errorText: "Invalid category ID!",
            checkFunction: async (i, msg) => {
                let category: CategoryChannel;
                if (msg.content.toLowerCase() == "create") {
                    const newChannel = await message.guild.channels.create("Tickets", {
                        type: "category"
                    });
                    category = newChannel;
                } else if (message.guild.channels.cache.filter(channel => channel.type == "category").has(msg.content)) category = message.guild.channels.cache.get(msg.content) as CategoryChannel;
                if (category) {
                    responses.categoryID = category.id;
                    return true;
                } else return false;
            }
        }, {
            title: "#2 Ticket Manager Role",
            description: "Please mention a role or provide a role ID! Type `create` to let me create one!",
            errorText: "Invalid role or role ID!",
            checkFunction: async (i, msg) => {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "Ticket Manager"
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first() && message.guild.roles.cache.has(msg.mentions.roles.first().id)) role = msg.mentions.roles.first();
                    else if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) {
                    responses.managerRoleID = role.id;
                    return true;
                } else return false;
            }
        }], message.channel, (m) => m.author.id == message.author.id, {
            description: "Cancelled ticket setup!",
            commandUsage: this.usage
        }, async () => {
            const ticketCategory = message.guild.channels.cache.get(responses.categoryID) as CategoryChannel;
            await ticketCategory.updateOverwrite(responses.managerRoleID, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            });
            await ticketCategory.updateOverwrite(message.guild.id, {
                VIEW_CHANNEL: false
            });
            await client.cache.updateGuild(message.guild.id, {
                ticket: responses
            });
            return client.createSuccess(message, { title: "🎫 Ticket Setup", description: "Successfully completed ticket setup!" });
        }, true);
    };
};