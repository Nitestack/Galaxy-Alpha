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
        const prompts = [
            "Invalid category ID! Please provide a category ID or just type `create` to let me create one!",
            "Invalid role! Please mention a role or provide a role ID!\nTo let me create a role simply type `create`!",
            "Invalid channel! If you want a modmail log channel, please mention a channel or provide a channel ID!\nTo let me create a modmail log channel, please type `create`!\nIf you don't want a modmail log channel, type `none`!",
            "Welcome to ModMail setup!\nFirst copy the ID of the modmail category channel and paste in here or just type `create` to let me create one!",
            "Now you have to mention a modmail manager role or provide a role id!\nOtherwise type `create` to create one role!",
            "**OPTIONAL:** Do you want a modmail log channel? If yes, please mention a channel or provide a channel ID!\nType `create` to let me create one channel,\ntype `none` to ignore this feature!"
        ];
        const modMailSetupManager = "📭 ModMail Setup";
        const response: {
            categoryID: string,
            roleID: string,
            logChannelID: "none" | string
        } = {
            categoryID: null,
            roleID: null,
            logChannelID: null
        };
        for (let i = 3; i < prompts.length; i++) {
            if (i < 3) message.channel.send(client.createRedEmbed().setTitle(modMailSetupManager + " Manager").setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the process!"));
            if (i >= 3) message.channel.send(client.createEmbed().setTitle(modMailSetupManager).setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the process!"));
            const msg = (await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, { max: 1, time: 30000 })).first();
            if (!msg || msg.content.toLowerCase() == "cancel") return client.createArgumentError(message, { title: modMailSetupManager + " Manager", description: "Cancelled modmail setup!" }, this.usage);
            if (i == 0) { //INVALID CATEGORY
                if (msg.content.toLowerCase() == "create") {
                    if (message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                        const categoryChannel = await message.guild.channels.create("ModMail", {
                            type: "category"
                        });
                        response.categoryID = categoryChannel.id;
                        i = 3;
                    } else i = -1;
                } else {
                    if (message.guild.channels.cache.filter(channel => channel.type == "category").has(msg.content)) {
                        response.categoryID = msg.content;
                        i = 3;
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
                    response.roleID = role.id;
                    i = 4;
                } else i = 0;
            } else if (i == 2) { //INVALID CHANNEL
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
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) channel = message.mentions.channels.first();
                    if (message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(msg.content)) channel = message.guild.channels.cache.get(msg.content) as TextChannel | NewsChannel;
                };
                if (channel) response.logChannelID = channel.id;
                if (response.logChannelID) i = 5;
                else i = 1;
            } else if (i == 3) {
                if (msg.content.toLowerCase() == "create") {
                    if (message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                        const categoryChannel = await message.guild.channels.create("ModMail", {
                            type: "category"
                        });
                        response.categoryID = categoryChannel.id;
                    } else i = -1;
                } else {
                    if (message.guild.channels.cache.filter(channel => channel.type == "category").has(msg.content)) {
                        response.categoryID = msg.content;
                    } else i = -1;
                };
            } else if (i == 4) {
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
                else i = 0;
            } else if (i == 5) {
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
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) channel = message.mentions.channels.first();
                    if (message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(msg.content)) channel = message.guild.channels.cache.get(msg.content) as TextChannel | NewsChannel;
                };
                if (channel) response.logChannelID = channel.id;
                if (!response.logChannelID) i = 1;
            };
        };
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
        return client.createSuccess(message, { title: modMailSetupManager, description: "Sucessfully completed modmail setup!" });
    };
};