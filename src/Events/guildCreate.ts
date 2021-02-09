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
		await GuildSchema.findOneAndUpdate({
			guildID: guild.id,
		}, {
			guildPrefix: client.globalPrefix,
			logChannelID: null,
			guildShardID: guild.shardID,
			muteRole: null,
			memberRole: null,
			ticketCategory: null,
			ticketRole: null,
			giveawayByPass: null,
			giveawayBlackListed: null,
			giveawayPing: null,
			welcomeMessage: null,
			welcomeEmbed: false,
		}, {
			upsert: true
		});
		(guild.channels.cache.filter(channel => channel.type == "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES") && channel.permissionsFor(client.user).has("EMBED_LINKS")).first() as TextChannel).send(client.createEmbed()
			.setTitle(`Thanks for adding ${client.user.username} to your server!`)
			.setDescription(`**Thanks for adding this bot to your server!**\nFor help use the command \`${client.globalPrefix}help\` to see the commands list!\nTo see more informations about a command use the command \`${client.globalPrefix}help <command name>\`!\nHope you enjoy using **${client.user.username}**!`));
	};
};