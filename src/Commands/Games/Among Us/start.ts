import Command, { CommandRunner } from "@root/Command";

export default class StartCommand extends Command {
    constructor(){
        super({
            name: "austart",
            description: "starts an Among Us game",
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
            await member.voice.setDeaf(true);
        });
        return client.createSuccess(message, { title: "Among Us Manager", description: "Started Among Us round!"});
    };
};