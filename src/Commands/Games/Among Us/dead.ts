import Command, { CommandRunner } from "@root/Command";
import { GuildMember } from "discord.js";

export default class DeadCommand extends Command {
    constructor(){
        super({
            name: "au-dead",
            description: "mutes a member in a voice channel",
            category: "games",
            guildOnly: true,
            userPermissions: ["MUTE_MEMBERS"],
            clientPermissions: ["MUTE_MEMBERS"]
        });
    };
    run: CommandRunner = async (client, message, args) => {
        if (!message.member.voice.channel) return client.createArgumentError(message, { title: "Among Us Manager", description: "You have to be in a voice channel!" }, this.usage);
        let target: GuildMember;
        if (message.mentions.users.first() && message.guild.members.cache.filter(member => !member.user.bot).has(message.mentions.users.first().id)) target = message.guild.members.cache.get(message.mentions.users.first().id);
        if (args[0] && message.guild.members.cache.filter(member => !member.user.bot).has(args[0])) target = message.guild.members.cache.get(args[0]);
        if (!target) return client.createArgumentError(message, { title: "Among Us Manager", description: "You have mention an user or provide an user ID!" }, this.usage);
        if (!target.voice.channel) return client.createArgumentError(message, { title: "Among US Manager", description: "This member is not in a voice channel!" }, this.usage);
        if (message.member.voice.channel.id != target.voice.channel.id) return client.createArgumentError(message, { title: "Among Us Manager", description: "This member is not in the same voice channel as you!" }, this.usage); 
        await target.voice.setMute(true);
        return message.channel.send(client.createRedEmbed()
            .setTitle("Among Us")
            .setDescription(`. 　　　。　　　　•　 　ﾟ　　。 　　.\n\n　　　.　　　 　　.　　　　　。　　 。　. 　\n\n.　　 。　　　ﾟ　　<:among_us:813372439534108692>。 . 　　 • 　　　　•\n\n'　　ﾟ　　           **${target.displayName}** was ejected! 　 。　•\n\n　.　　　'　　　。　　ﾟ。　　ﾟ。　　ﾟ。　　ﾟ\n\n　　。　　ﾟ　　　•　　　. 　ﾟ　　　　'　 .`));
    };
};