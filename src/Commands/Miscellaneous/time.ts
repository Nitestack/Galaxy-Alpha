import Command, { CommandRunner } from '@root/Command';

export default class TimeCommand extends Command {
    constructor(){
        super({
            name: "time",
            description: "shows the current time",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return message.channel.send(client.createEmbed()
            .setTitle('🕑 Current Time')
            .setDescription(`**${client.util.dateFormatter(message.createdAt)}**`));
    };
};