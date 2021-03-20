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
        const prompts = [
            "Invalid channel ID!\nPlease mention a channel or provide a channel ID or type `create` to let me create a channel!",
            "Invalid role!\nPlease mention a role or provide a role ID! To let me create a role simply type `create`!",
            "Please mention a channel or provide a channel ID or just type `create` to let me create a suggestion channel!",
            "Now you have to mention a role or provide a role ID!\nTo let me create a role, simply type `create`!"
        ];
        const suggestionSetupManager = `${client.developerToolsEmoji} Suggestion Setup`;
        const response: {
            channelID: string,
            managerRoleID: string
        } = {
            channelID: null,
            managerRoleID: null
        };
        for (let i = 2; i < prompts.length; i++) {
            if (i < 2) message.channel.send(client.createRedEmbed().setTitle(suggestionSetupManager + " Manager").setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the process!"));
            if (i >= 2) message.channel.send(client.createEmbed().setTitle(suggestionSetupManager).setDescription(prompts[i]).addField("How to cancel?", "Simply type `cancel` to cancel the process!"));
            const msg = (await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, { max: 1, time: 30000 })).first();
            if (!msg || msg.content.toLowerCase() == "cancel") return client.createArgumentError(message, { title: suggestionSetupManager + " Manager", description: "Cancelled suggestion setup!" }, this.usage);
            if (i == 0) { //INVALID CHANNEL
                if (msg.content.toLowerCase() == "create") {
                    if (message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                        const categoryChannel = await message.guild.channels.create("suggestions", {
                            type: "text"
                        });
                        response.channelID = categoryChannel.id;
                        i = 2;
                    } else i = -1;
                } else {
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) {
                        response.channelID = msg.mentions.channels.first().id;
                        i = 2;
                    } else if (message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(msg.content)) {
                        response.channelID = msg.content;
                        i = 2;
                    } else i = -1;
                };
            } else if (i == 1) { //INVALID ROLE
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
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) {
                    response.managerRoleID = role.id;
                    i = 3;
                } else i = 0;
            } else if (i == 2) {
                if (msg.content.toLowerCase() == "create") {
                    if (message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                        const categoryChannel = await message.guild.channels.create("suggestions", {
                            type: "text"
                        });
                        response.channelID = categoryChannel.id;
                    } else i = -1;
                } else {
                    if (msg.mentions.channels.first() && message.guild.channels.cache.has(msg.mentions.channels.first().id)) response.channelID = msg.mentions.channels.first().id;
                    else if (message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(msg.content)) response.channelID = msg.content;
                    else i = -1;
                };
            } else if (i == 3) {
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
                    if (message.guild.roles.cache.has(msg.content)) role = message.guild.roles.cache.get(msg.content);
                };
                if (role) response.managerRoleID = role.id;
                else i = 0;
            };
        };
        await client.cache.updateGuild(message.guild.id, {
            suggestionChannelID: response.channelID,
            suggestionManagerRoleID: response.managerRoleID
        });
        return client.createSuccess(message, { title: suggestionSetupManager + " Manager", description: "Successfully completed suggestion setup!" });
    };
};