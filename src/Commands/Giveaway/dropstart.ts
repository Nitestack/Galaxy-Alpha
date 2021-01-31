import Command from '@root/Command';
import { dropManager } from './Drop';

module.exports = class DropStartCommand extends Command {
    constructor(client) {
        super(client, {
            name: "dropstart",
            description: "starts a drop",
            category: "giveaway",
            usage: "dropstart <prize>",
            aliases: ["dstart"],
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        const prize: string = args.join(" ");
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(dropManager)
            .setDescription("You have to provide a prize!"));
        return client.drop.create({
            prize: prize,
            guildID: message.guild.id,
            channelID: message.channel.id,
            createdBy: message.author
        }, message);
    };
};