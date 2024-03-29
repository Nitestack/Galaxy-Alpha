import Event, { EventRunner } from '@root/Event';
import { GuildMember, NewsChannel, TextChannel } from 'discord.js';

export default class GuildMemberAddEvent extends Event {
	constructor() {
		super({
			name: "guildMemberAdd"
		});
	};
	run: EventRunner = async (client, member: GuildMember) => {
		if (member.guild.id == client.supportGuildID) member.roles.add(client.supportGuild.roles.cache.get("798156877506281473").id);
		const guildSettings = await client.cache.getGuild(member.guild.id);
		if (!guildSettings) return;
		if (client.cache.mutes.has(`${member.guild.id}-${member.id}`)) await member.roles.add(guildSettings.muteRoleID);
		if (guildSettings.welcomeMessage && (guildSettings.welcomeChannelID == "dm" ? true : member.guild.channels.cache.has(guildSettings.welcomeChannelID)) && guildSettings.welcomeMessageType) (guildSettings.welcomeChannelID == "dm" ? member : member.guild.channels.cache.get(guildSettings.welcomeChannelID) as TextChannel | NewsChannel).send(guildSettings.welcomeMessageType == "embed" ? client.createEmbed()
				.setAuthor(member.guild.name, member.guild.iconURL())
				.setDescription(replacer(guildSettings.welcomeMessage)) : replacer(guildSettings.welcomeMessage));
		if (guildSettings.memberRoleID) await member.roles.add(guildSettings.memberRoleID);
		function replacer(string: string): string {
			let text: string = string;
			if (string.includes("{user:mention}")) text = text.replace(/{user:mention}/g, `${member}`);
			if (string.includes("{user:username}")) text = text.replace(/{user:username}/g, `${member.user.username}`);
			if (string.includes("{user:discriminator}")) text = text.replace(/{user:discriminator}/g, `${member.user.discriminator}`);
			if (string.includes("{user:avatar}")) text = text.replace(/{user:avatar}/g, `${member.user.displayAvatarURL({ dynamic: true, format: "png" })}`);
			if (string.includes("{user:createdAt}")) text = text.replace(/{user:createdAt}/g, `${member.user.createdAt}`);
			if (string.includes("{user:createdAgo}")) text = text.replace(/{user:createdAgo}/g, `${client.ms(Date.now() - member.user.createdTimestamp)}`);
			if (string.includes("{user:joinedAt}")) text = text.replace(/{user:joinedAt}/g, `${member.joinedAt}`);
			if (string.includes("{user:joinedAgo}")) text = text.replace(/{user:joinedAgo}/g, `${client.ms(Date.now() - member.joinedTimestamp)}`);
			if (string.includes("{server:name}")) text = text.replace(/{server:name}/g, `${member.guild.name}`);
			if (string.includes("{server:members}")) text = text.replace(/{server:members}/g, `${member.guild.memberCount}`);
			if (string.includes("{server:bots}")) text = text.replace(/{server:bots}/g, `${member.guild.members.cache.filter(member => member.user.bot).size}`);
			if (string.includes("{server:user}")) text = text.replace(/{server:user}/g, `${member.guild.members.cache.filter(member => !member.user.bot).size}`);
			if (string.includes("{server:createdAt}")) text = text.replace(/{server:createdAt}/g, `${member.guild.createdAt}`);
			if (string.includes("{server:createdAgo}")) text = text.replace(/{server:createdAgo}/g, `${client.ms(Date.now() - member.guild.createdTimestamp)}`);
			if (string.includes("{server:icon}")) text = text.replace(/${server:icon}/g, `${member.guild.iconURL({ dynamic: true, format: "png" })}`);
			return text;
		};
	};
};