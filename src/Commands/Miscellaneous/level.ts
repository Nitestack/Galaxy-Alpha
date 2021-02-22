import Command, { CommandRunner } from "@root/Command";
import canvacord from "canvacord";
import { User, MessageAttachment } from "discord.js";
import LevelSchema from "@models/level";

export default class LevelCommand extends Command {
    constructor(){
        super({
            name: "level",
            description: "shows the current level of an user",
            aliases: ["rank"],
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let targetUser: User = message.author;
        if (message.mentions.users.first() && message.guild.members.cache.filter(member => !member.user.bot).has(message.mentions.users.first().id)) targetUser = message.mentions.users.first();
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) targetUser = message.guild.members.cache.get(args[0]).user;
        let user = await client.cache.getLevelandMessages(message.guild.id, targetUser.id);
        const rankInServer = (await LevelSchema.find({ guildID: message.guild.id }).sort({ xp: - 1 })).findIndex(user => user.userID == targetUser.id) + 1;
        const neededXP = (user.level + 1) * (user.level + 1) * 100;
        const rank = new canvacord.Rank()
            .setAvatar(targetUser.displayAvatarURL({ format: "png"}))
            .setCurrentXP(user ? user.xp : 0)
            .setRequiredXP(neededXP)
            .setLevel(user.level)
            .setRank(rankInServer)
            .setStatus(message.guild.members.cache.get(targetUser.id).presence.status, true)
            .setProgressBar(client.defaultColor, "COLOR")
            .setUsername(targetUser.username)
            .setDiscriminator(targetUser.discriminator)
            .setBackground("IMAGE", "src/Images/CanvasWallpaper.png");
        rank.build().then(data => {
            const attachment = new MessageAttachment(data, "level.png");
            return message.channel.send("", attachment);
        });
    };
};