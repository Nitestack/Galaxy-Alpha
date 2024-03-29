import Command, { CommandRunner } from "@root/Command";

export default class ResetCommand extends Command {
    constructor(){
        super({
            name: "au-reset",
            description: "resets an Among Us round",
            aliases: ["aurevive"],
            category: "games",
            guildOnly: true,
            userPermissions: ["MUTE_MEMBERS"],
            clientPermissions: ["MUTE_MEMBERS"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!message.member.voice.channel) return client.createArgumentError(message, { title: "Among Us Manager", description: "You need to be in a voice channel to use this command!" }, this.usage);
        const channel = message.member.voice.channel;
        channel.members.filter(member => !member.user.bot).forEach(async member => {
            await member.voice.setDeaf(false);
            await member.voice.setMute(false);
        });
        return client.createSuccess(message, { title: "Among Us Manager", description: "Resetted the Among Us round!"});
    };
};