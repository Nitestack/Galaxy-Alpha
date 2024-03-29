import GalaxyAlpha from "@root/Client";
import Feature, { FeatureRunner } from "@root/Feature";
import { TextChannel, NewsChannel, Guild } from "discord.js";

export default class GuildLoggerFeature extends Feature {
    constructor() {
        super({
            name: "guildlogger"
        });
    };
    run: FeatureRunner = async (client) => {
        const channel = client.supportGuild.channels.cache.get("818211521984200737") as TextChannel | NewsChannel;
        client.on("guildCreate", (guild) => {
            const { text, title } = this.textCreator(client, guild);
            return channel.send(client.createGreenEmbed()
                .setAuthor(guild.owner.user.username, guild.owner.user.displayAvatarURL({ dynamic: true }))
                .setTitle(title)
                .setDescription(text));
        });
        client.on("guildDelete", (guild) => {
            const { text, title } = this.textCreator(client, guild);
            return channel.send(client.createRedEmbed()
                .setAuthor(guild.owner.user.username, guild.owner.user.displayAvatarURL({ dynamic: true }))
                .setTitle(title)
                .setDescription(text));
        });
    };
    private textCreator(client: GalaxyAlpha, guild: Guild) {
        let title: string = `${guild.name}`;
        if (guild.partnered) title = `<:partner:786331679101943849> ${guild.name}\n`;
        if (guild.verified) title = `<:discord_verified:786332605611376672> ${guild.name}\n`;
        let verification: string = "";
        if (guild.verificationLevel == 'NONE') verification = `🎚️ **Verification Level:\nNone** - Unrestricted`;
        if (guild.verificationLevel == 'LOW') verification = `🎚️ **Verification Level:\nLow** - Must have a verified email on their Discord account`;
        if (guild.verificationLevel == 'MEDIUM') verification = `🎚️ **Verification Level:\nMedium** - Must also be registered on Discord for longer than 5 minutes`;
        if (guild.verificationLevel == 'HIGH') verification = `🎚️ **Verification Level:\nHigh** - Must also be a member of this server for longer than 10 minutes`;
        if (guild.verificationLevel == 'VERY_HIGH') verification = `🎚️ **Verification Level:\nHighest** - Must have a verified phone on their Discord account`;
        let text: string = `👑 **Owner:** ${guild.owner}
        **📝 Description**: ${guild.description || "No description"}
        🗺️ **Region:** ${guild.region[0].toUpperCase() + guild.region.slice(1).toString()}
        ${client.memberEmoji} **Total Members:** \`${guild.memberCount.toLocaleString()}\`/\`${guild.maximumMembers.toLocaleString()}\` (\`${guild.members.cache.filter(member => member.user.bot).size.toLocaleString()}\` bots)
        🗓️ **Created at:** ${client.util.dateFormatter(guild.createdAt)}
        📨 **Default Message Notifications:** ${(guild.defaultMessageNotifications as string).toLowerCase()}
        ${verification}
        💎 **Boost:** Level \`${guild.premiumTier}\` with \`${guild.premiumSubscriptionCount.toLocaleString()}\` boosts\n`;
        if (guild.vanityURLCode) text += `⭐ **Vanity Link:** https://discord.gg/${guild.vanityURLCode} (already used for \`${guild.vanityURLUses}\` times)\n`;
        if (guild.rulesChannel) text += `📚 **Rules:** ${guild.rulesChannel}\n`;
        text += `\n**NOW THIS BOT IS ON \`${client.guilds.cache.size.toLocaleString()}\` servers!**`;
        return {
            title, 
            text
        };
    };
};