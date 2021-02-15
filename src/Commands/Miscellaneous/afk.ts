import Command, { CommandRunner } from "@root/Command";

export default class AFKCommand extends Command {
    constructor(){
        super({
            name: "afk",
            description: "set's your afk status",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const reason = args.join(" ") || "No reason provided!";
        client.afks.set(message.author.id, {
            userID: message.author.id,
            afkSince: message.createdAt,
            reason: reason
        });
        return client.createSuccess(message, { title: "AFK Manager", description: `Set your afk status to: \`${reason}\`!`});
    };
};