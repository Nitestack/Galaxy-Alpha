import Command from '@root/Command';
import { giveawayManager } from '@commands/Giveaway/Giveaway';
import Guild from '@models/guild';

export default class GiveawayRerollCommand extends Command {
    constructor() {
        super({
            name: "giveawayreroll",
            description: "rerolls a giveaway",
            category: "giveaway",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            usage: "giveawayreroll <Message ID>",
            aliases: ["greroll"]
        });
    };
    async run(client, message, args, prefix) {
        let giveawayManagerRole;
        await Guild.findOne({
            guildID: message.guild.id
        }, {}, {}, (err, guild) => {
            if (err) return console.log(err);
            if (!guild.giveawayManager) return;
            if (guild.giveawayManager) giveawayManagerRole = message.guild.roles.cache.get(guild.giveawayManager);
        });
        if (giveawayManagerRole) {
            if (!message.member.roles.cache.has(giveawayManagerRole.id) && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle(giveawayManager)
                .setDescription("You need the permission `Manage Server` or the giveaway creator role for this server!"));
        } else {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle(giveawayManager)
                .setDescription("You need the permission `Manage Server` or the giveaway creator role for this server!"));
        };
        const messageID: string = args[0];
        if (!messageID) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("You have to provide a message ID!"));

        const reroll = client.giveaways.reroll(messageID, message.channel, `${prefix}${this.usage}`);
        if (!reroll) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle(giveawayManager)
            .setDescription("This giveaway has not ended yet!"));
    };
};