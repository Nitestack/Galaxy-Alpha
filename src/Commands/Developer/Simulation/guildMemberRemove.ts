import Command, { CommandRunner } from "@root/Command";
import { GuildMember } from "discord.js";

export default class GuildMemberRemoveCommand extends Command {
    constructor(){
        super({
            name: "guildmemberremove",
            description: "simulates a server leave",
            category: "developer",
            developerOnly: true,
            guildOnly: true,
            usage: "guildmemberremove [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let member: GuildMember = message.member;
        if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id)) member = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.has(args[0])) member = message.guild.members.cache.get(args[0]);
        return client.emit("guildMemberRemove", member);
    };
};