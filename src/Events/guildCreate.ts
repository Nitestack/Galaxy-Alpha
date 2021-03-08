import { Guild, TextChannel } from 'discord.js';
import Event, { EventRunner } from '@root/Event';

export default class GuildCreateEvent extends Event {
	constructor() {
		super({
			name: "guildCreate"
		});
	};
	run: EventRunner = async (client, guild: Guild, message?: boolean) => {
		await client.cache.getGuild(guild.id);
		if (!message) {
			(guild.channels.cache.filter(channel => channel.type == "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES") && channel.permissionsFor(client.user).has("EMBED_LINKS")).first() as TextChannel).send(client.createEmbed()
				.setTitle(`Thanks for adding ${client.user.username} to your server!`)
				.setDescription(`**Thanks for adding this bot to your server!**
				My default prefix is \`${client.globalPrefix}\`, but you can change it with \`${client.globalPrefix}prefix <new prefix>\`!
				For help use the command \`${client.globalPrefix}help\` to see all commands!
				To see more informations about a command use the command \`${client.globalPrefix}help <command name>\`!
				Hope you enjoy using **${client.user.username}**!`));
		};
	};
};