import Event from '@root/Event';
import { DMChannel, Guild, GuildChannel, Role } from 'discord.js';

import GuildSchema from '@models/guild';
import GalaxyAlpha from '@root/Client';

module.exports = class ChannelCreateEvent extends Event {
	constructor(){
		super({
			name: "channelCreate"
		});
	};
	async run(client: GalaxyAlpha, channel: DMChannel | GuildChannel) {
		if (channel.type == 'dm') return;
		const result = await GuildSchema.findOne(
			{
				guildID: channel.guild.id,
			},
			(err: unknown, guild: any) => {
				if (err) console.log(err);
				if (!guild || !guild.muteRole) return;
			}
		);
		if (!result.guildID || !result.muteRole) return;
		const guild: Guild = client.guilds.cache.get(result.guildID);
		const muteRole: Role = guild.roles.cache.get(result.muteRole);
		if (!guild || !muteRole) return;
		if (channel.type == 'voice') {
			return channel.createOverwrite(muteRole, {
				CONNECT: false,
			});
		} else if (channel.type == 'category') {
			return channel.createOverwrite(muteRole, {
				CONNECT: false,
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
			});
		} else if (
			channel.type == 'news' ||
			channel.type == 'text' ||
			channel.type == 'store'
		) {
			return channel.createOverwrite(muteRole, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
			});
		} else {
			return;
		}
	};
};