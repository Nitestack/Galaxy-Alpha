import Command, { CommandRunner } from '@root/Command';
import { TextChannel } from 'discord.js';
import ms from 'ms';

export default class SlowmodeCommand extends Command {
    constructor() {
        super({
            name: "slowmode",
            description: "sets the slowmode for a channel",
            usage: "slowmode <duration/off>",
            category: "management",
            userPermissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
            requiredRoles: ["serverManagerRoleID"],
            guildOnly: true,
            args: [{
                type: "custom",
                index: 1,
                filter: (message, arg) => (ms(arg as string) && ms(arg as string) <= 21600000 && ms(arg as string) >= ms("1s")) || arg.toLowerCase() == "off" ? true : false,
                required: true,
                errorTitle: "🕐 Slowmode Manager",
                errorMessage: "You have to provide a duration for the slowmode in this channel!\nThe duration must be less than or equal to 6h!\nYou can use `s` for seconds, `m` for minutes and `h` for hours!\nType `off` to turn off the slowmode!"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (message.channel.type == 'news') return message.channel.send(client.createRedEmbed(true, `${prefix}slowmode <duration/off>`)
            .setTitle("🕐 Slowmode Manager")
            .setDescription("You cannot setup a slowmode in announcement channels!"));
        if (args[0].toLowerCase() == 'off') {
            (message.channel as TextChannel).setRateLimitPerUser(0);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🕐 Slowmode Manager")
                .setDescription(`Turned of the slowmode in this channel!`));
        } else {
            (message.channel as TextChannel).setRateLimitPerUser(client.ms(args[0] as string) / 1000);
            return message.channel.send(client.createGreenEmbed()
                .setTitle("🕐 Slowmode Manager")
                .setDescription(`Set the slowmode duration of this channel to: **${args[0]}**!`));
        };
    };
};