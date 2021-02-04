import Event from '@root/Event';
import { GuildMember, NewsChannel, TextChannel } from 'discord.js';
import GuildSchema from '@models/guild';
import GalaxyAlpha from '@root/Client';

export default class GuildMemberAddEvent extends Event {
	constructor() {
		super({
			name: "guildMemberAdd"
		});
	};
	async run(client: GalaxyAlpha, member: GuildMember) {
		await GuildSchema.findOne({
			guildID: member.guild.id
		}, {}, {}, (err, guild) => {
			if (err) return console.log(err);
			if (guild.welcomeChannelID == 'dm') {
				member.send(guild.welcomeEmbed ? client.createEmbed().setDescription(`${replacer(guild.welcomeMessage)}`) : `${replacer(guild.welcomeMessage)}`);
			} else {
				const welcomeChannel: TextChannel | NewsChannel = (client.channels.cache.filter(channel => channel.type == 'text' || channel.type == 'news').get(guild.welcomeChannelID) as TextChannel | NewsChannel);
				if (welcomeChannel) {
					welcomeChannel.send(guild.welcomeEmbed ? client.createEmbed().setDescription(`${replacer(guild.welcomeMessage)}`) : `${replacer(guild.welcomeMessage)}`);
				} else {
					return;
				};
			};
		});
		if (member.guild.id == client.supportGuildID) member.roles.add(client.supportGuild.roles.cache.get("798156877506281473").id);
		function replacer(string: string) {
			let text: string = string;
			if (string.includes("{user:mention}")) text = text.replace(/{user:mention}/g, `${member}`);
			if (string.includes("{user:username}")) text = text.replace(/{user:username}/g, `${member.user.username}`);
			if (string.includes("{user:discriminator}")) text = text.replace(/{user:discriminator}/g, `${member.user.discriminator}`);
			if (string.includes("{user:avatar}")) text = text.replace(/{user:avatar}/g, `${member.user.displayAvatarURL()}`);
			if (string.includes("{user:createdAt}")) text = text.replace(/{user:createdAt}/g, `${member.user.createdAt}`);
			if (string.includes("{user:createdAgo}")) text = text.replace(/{user:createdAgo}/g, `${client.ms(Date.now() - member.user.createdTimestamp)}`);
			if (string.includes("{user:joinedAt}")) text = text.replace(/{user:joinedAt}/g, `${member.joinedAt}`);
			if (string.includes("{user:joinedAgo}")) text = text.replace(/{user:joinedAgo}/g, `${client.ms(Date.now() - member.joinedTimestamp)}`);
			if (string.includes("{server:name}")) text = text.replace(/{server:name}/g, `${member.guild.name}`);
			if (string.includes("{server:members}")) text = text.replace(/{server:members}/g, `${member.guild.memberCount}`);
			if (string.includes("{server:user}")) text = text.replace(/{server:user}/g, `${member.guild.members.cache.filter(member => !member.user.bot).size}`);
			if (string.includes("{server:createdAt}")) text = text.replace(/{server:createdAt}/g, `${member.guild.createdAt}`);
			if (string.includes("{server:createdAgo}")) text = text.replace(/{server:createdAgo}/g, `${client.ms(Date.now() - member.guild.createdTimestamp)}`);
			return text;
		};
	};
};