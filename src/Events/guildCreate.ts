import GuildSchema from '@models/guild';
import { Guild, TextChannel } from 'discord.js';
import Event, { EventRunner } from '@root/Event';

export default class GuildCreateEvent extends Event {
	constructor() {
		super({
			name: "guildCreate"
		});
	};
	run: EventRunner = async (client, guild: Guild) => {
		const channel = client.supportGuild.channels.cache.get("811353629272965130") as TextChannel;
		let title: string = `${guild.name}`;
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
        if (guild.partnered) title = `<:partner:786331679101943849> ${guild.name}\n`;
        if (guild.verified) title = `<:discord_verified:786332605611376672> ${guild.name}\n`;
        if (guild.vanityURLCode) text += `⭐ **Vanity Link:** https://discord.gg/${guild.vanityURLCode} (already used for \`${guild.vanityURLUses}\` times)\n`;
        if (guild.rulesChannel) text += `📚 **Rules:** ${guild.rulesChannel}\n`;
		text += `\n**NOW THIS BOT IS ON \`${client.guilds.cache.size.toLocaleString()}\` servers!**`;
		channel.send(client.createGreenEmbed()
			.setAuthor(guild.owner.user.username, guild.owner.user.displayAvatarURL({ dynamic: true}))
			.setTitle(title)
			.setDescription(text));
		const newGuild = await GuildSchema.create({
			guildID: guild.id,
			prefix: client.globalPrefix
		});
		newGuild.save().catch(err => console.log(err));
		(guild.channels.cache.filter(channel => channel.type == "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES") && channel.permissionsFor(client.user).has("EMBED_LINKS")).first() as TextChannel).send(client.createEmbed()
			.setTitle(`Thanks for adding ${client.user.username} to your server!`)
			.setDescription(`**Thanks for adding this bot to your server!**
			My default prefix is \`${client.globalPrefix}\`, but you can change it with \`${client.globalPrefix}prefix <new prefix>\`!
			For help use the command \`${client.globalPrefix}help\` to see all commands!
			To see more informations about a command use the command \`${client.globalPrefix}help <command name>\`!
			Hope you enjoy using **${client.user.username}**!`));
	};
};