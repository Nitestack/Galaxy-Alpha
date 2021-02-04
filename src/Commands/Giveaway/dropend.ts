import Command from '@root/Command';
import { dropManager } from '@commands/Giveaway/Drop';

export default class DropEndCommand extends Command {
    constructor() {
        super({
            name: "dropend",
            description: "ends a drop",
            category: "giveaway",
            aliases: ["dend"],
            userPermissions: ["MANAGE_GUILD"],
            usage: "dropend <Message ID>",
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        if (!args[0]) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(dropManager)
            .setDescription("You have to provide a message ID!"));
        const drop = client.drop.end(args.slice().join(" "));
        if (drop) {
            return message.channel.send(client.createGreenEmbed()
                .setTitle(dropManager)
                .setDescription("Drop successfully ended!"));
        } else {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle(dropManager)
                .setDescription("Invalid message ID!"));
        };
    };
};