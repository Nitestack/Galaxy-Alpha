import Command, { CommandRunner } from "@root/Command";

export default class PollCommand extends Command {
    constructor(){
        super({
            name: "poll",
            description: "reacts to the last message sent with thumbs",
            category: "utility",
            guildOnly: true,
            clientPermissions: ["MANAGE_MESSAGES"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        message.delete();
        const fetchedMessage = await message.channel.messages.fetch({ limit : 1 });
        await fetchedMessage.first().react("👍");
        await fetchedMessage.first().react("👎");
    };
};