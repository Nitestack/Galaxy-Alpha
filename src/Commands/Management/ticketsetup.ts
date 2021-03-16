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
        const prompts = [
            "Invalid category ID!\nPlease provide a category ID or type `create` to let me create a category!",
            "Invalid role!\nPlease mention a role or provide a role ID! To let me create a role simply type `create`!",
            "Please provide a category ID or just type `create` to let me create a ticket category!",
            "Now you have to mention a role or provide a role ID!\nTo let me create a role, simply type `create`!"
        ];
        const ticketSetupManager = "🎫 Ticket Setup";
        const response: {
            categoryID: string,
            managerRoleID: string
        } = {
            categoryID: null,
            managerRoleID: null
        };
        for (let i = 2; i < prompts.length; i++) {
            if (i < 2) message.channel.send(client.createRedEmbed().setTitle(ticketSetupManager + " Manager").setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the process!"));
            if (i >= 2) message.channel.send(client.createEmbed().setTitle(ticketSetupManager).setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the process!"));
            const msg = (await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, { max: 1, time: 30000 })).first();
            if (!msg || msg.content.toLowerCase() == "cancel") return client.createArgumentError(message, { title: ticketSetupManager + " Manager", description: "Cancelled ticket setup!" }, this.usage);
            if (i == 0) { //INVALID CATEGORY ID
                if (msg.content.toLowerCase() == "create") {
                    if (message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                        const categoryChannel = await message.guild.channels.create("Ticket", {
                            type: "category"
                        });
                        response.categoryID = categoryChannel.id;
                        i = 2;
                    } else i = -1;
                } else {
                    if (message.guild.channels.cache.filter(channel => channel.type == "category").has(msg.content)) {
                        response.categoryID = msg.content;
                        i = 2;
                    } else i = -1;
                };
            } else if (i == 1) { //INVALID ROLE
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
                if (role) {
                    response.managerRoleID = role.id;
                    i = 3;
                } else i = 0;
            } else if (i == 2) {
                if (msg.content.toLowerCase() == "create") {
                    if (message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                        const categoryChannel = await message.guild.channels.create("Ticket", {
                            type: "category"
                        });
                        response.categoryID = categoryChannel.id;
                    } else i = -1;
                } else {
                    if (message.guild.channels.cache.filter(channel => channel.type == "category").has(msg.content)) {
                        response.categoryID = msg.content;
                    } else i = -1;
                };
            } else if (i == 3) {
                let role: Role;
                if (msg.content.toLowerCase() == "create") {
                    const newRole = await message.guild.roles.create({
                        data: {
                            name: "Ticket Manager",
                        }
                    });
                    role = newRole;
                } else {
                    if (msg.mentions.roles.first()) role = msg.mentions.roles.first();
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) response.managerRoleID = role.id;
                else i = 0;
            };
        };
        const ticketCategory = message.guild.channels.cache.get(response.categoryID) as CategoryChannel;
        await ticketCategory.updateOverwrite(response.managerRoleID, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true
        });
        await ticketCategory.updateOverwrite(message.guild.id, {
            VIEW_CHANNEL: false
        });
        await client.cache.updateGuild(message.guild.id, {
            ticketCategoryID: response.categoryID,
            ticketManagerRoleID: response.managerRoleID
        });
        return client.createSuccess(message, { title: ticketSetupManager + " Manager", description: "Successfully completed ticket setup!" });
    };
};