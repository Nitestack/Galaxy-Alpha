import Command from '@root/Command';
import { giveawayManager } from '@root/Commands/Giveaway/Giveaway';
import Guild from '@models/guild';

export default class GiveawayEndCommand extends Command {
    constructor() {
        super({
            name: "giveawayend",
            description: "ends a giveaway",
            usage: "giveawayend <Message ID>",
            userPermissions: ["MANAGE_GUILD"],
            aliases: ["gend"],
            guildOnly: true,
            category: "giveaway"
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
            if (!message.member.roles.cache.has(giveawayManagerRole.id) && !message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(client.createRedEmbed(true, `${prefix}giveawaycreate`)
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
        const ended = client.giveaways.end(messageID);
        if (!ended) {
            return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
                .setTitle(giveawayManager)
                .setDescription("This giveaway has already ended!"));
        };
    };
};