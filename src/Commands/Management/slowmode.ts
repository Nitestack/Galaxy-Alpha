import Command, { CommandRunner } from '@root/Command';
import { TextChannel } from 'discord.js';

export default class SlowmodeCommand extends Command {
    constructor() {
        super({
            name: "slowmode",
            description: "sets the slowmode for a channel",
            usage: "slowmode <duration/off>",
            category: "management",
            userPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
            requiredRoles: ["serverManagerRoleID"],
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if ((!args[0].includes("s") && !args[0].includes("m") && !args[0].includes("h") && !args[0].includes("off")) || args[0].includes(".") || client.ms(args[0]) > 21600000 || client.ms(args[0]) < 1) return message.channel.send(client.createRedEmbed(true, `${prefix}slowmode <duration>`)
            .setTitle("🕐 Slowmode Manager")
            .setDescription("You have to provide a duration for the slowmode in this channel!\nThe duration must be less than or equal to 6h!\nYou can use `s` for seconds, `m` for minutes and `h` for hours!"));
        if (message.channel.type == 'news') return message.channel.send(client.createRedEmbed(true, `${prefix}slowmode <duration/off>`)
            .setTitle("🕐 Slowmode Manager")
            .setDescription("You cannot setup a slowmode in announcement channels!"));
        if (args[0].toLowerCase() == 'off') {
            (message.channel as TextChannel).setRateLimitPerUser(0);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🕐 Slowmode Manager")
                .setDescription(`Turned of the slowmode in this channel!`));
        } else {
            (message.channel as TextChannel).setRateLimitPerUser(client.ms(args[0]) / 1000);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🕐 Slowmode Manager")
                .setDescription(`Set the slowmode duration of this channel to: **${args[0]}**!`));
        };
    };
};