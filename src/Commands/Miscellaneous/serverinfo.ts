import Command, { CommandRunner } from '@root/Command';

export const name: string = 'serverinfo';

export default class ServerInfoCommand extends Command {
    constructor(){
        super({
            name: "serverinfo",
            description: "shows some stats about the server",
            guildOnly: true,
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const { guild } = message;
        const createdAt = guild.createdAt;
        let title: string = `📊 Information about ${guild.name}`;
        let verification: string = "";
        if (guild.verificationLevel == 'NONE') verification = `🎚️ **Verification Level:\nNone** - Unrestricted`;
        if (guild.verificationLevel == 'LOW') verification = `🎚️ **Verification Level:\nLow** - Must have a verified email on their Discord account`;
        if (guild.verificationLevel == 'MEDIUM') verification = `🎚️ **Verification Level:\nMedium** - Must also be registered on Discord for longer than 5 minutes`;
        if (guild.verificationLevel == 'HIGH') verification = `🎚️ **Verification Level:\nHigh** - Must also be a member of this server for longer than 10 minutes`;
        if (guild.verificationLevel == 'VERY_HIGH') verification = `🎚️ **Verification Level:\nHighest** - Must have a verified phone on their Discord account`;
        let text: string = `👑 **Owner:** ${guild.owner}
        🗺️ **Region:** ${guild.region[0].toUpperCase() + guild.region.slice(1).toString()}
        ${client.memberEmoji} **Total Members:** \`${guild.memberCount.toLocaleString()}\`/\`${guild.maximumMembers.toLocaleString()}\` (\`${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}\` bots)
        🗓️ **Created at:** ${client.util.weekDays[createdAt.getUTCDay()]}, ${client.util.monthNames[createdAt.getUTCMonth()]} ${createdAt.getUTCDate()}, ${createdAt.getUTCFullYear()}, ${createdAt.getUTCHours()}:${createdAt.getUTCMinutes()}:${createdAt.getUTCSeconds()} UTC
        📨 **Default Message Notifications:** ${(guild.defaultMessageNotifications as string).toLowerCase()}
        ${verification}
        💎 **Boost:** Level \`${guild.premiumTier}\` with \`${guild.premiumSubscriptionCount.toLocaleString()}\` boosts\n`;
        if (guild.partnered) title = `📊 Information about <:partner:786331679101943849> ${guild.name}\n`;
        if (guild.verified) title = `📊 Information about <:discord_verified:786332605611376672> ${guild.name}\n`;
        if (guild.vanityURLCode) text += `⭐ **Vanity Link:** https://discord.gg/${guild.vanityURLCode} (already used for \`${guild.vanityURLUses}\` times)\n`;
        if (guild.rulesChannel) text += `📚 **Rules:** ${guild.rulesChannel}\n`;

        return message.channel.send(client.createEmbed()
            .setTitle(title)
            .setDescription(text)
            .setThumbnail(guild.iconURL()));
    };
};