import GalaxyAlpha from '@root/Client';
import Event, { EventRunner } from '@root/Event';
import { GuildChannel, DMChannel, Guild, Role } from 'discord.js';
import GuildSchema from '@models/guild';

export default class ChannelUpdateEvent extends Event {
	constructor() {
		super({
			name: 'channelUpdate'
		});
	};
	run: EventRunner = async (client, oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) => {
		if (newChannel.type == 'dm') return;
		await GuildSchema.findOne({
			guildID: newChannel.guild.id,
		}, {}, {}, (err, guild) => {
			if (err) console.log(err);
			if (!guild || !guild.muteRole) return;
			if (guild.muteRole) return muteRole(client, newChannel, guild.guildID, guild.muteRole);
		});
	};
};

async function muteRole(client: GalaxyAlpha, channel: DMChannel | GuildChannel, guildID: string, muteRoleID: string) {
	if (!guildID || !muteRoleID) return;
	if (!muteRoleID == null) return;
	const guild: Guild = client.guilds.cache.get(guildID);
	const muteRole: Role = guild.roles.cache.get(muteRoleID);
	if (!guild || !muteRole) return;
	if (channel.type == 'voice') {
		await channel.createOverwrite(muteRole, {
			CONNECT: false,
		});
	} else if (channel.type == 'category') {
		await channel.createOverwrite(muteRole, {
			CONNECT: false,
			SEND_MESSAGES: false,
			ADD_REACTIONS: false,
		});
	} else if (
		channel.type == 'news' ||
		channel.type == 'text' ||
		channel.type == 'store'
	) {
		await channel.createOverwrite(muteRole, {
			SEND_MESSAGES: false,
			ADD_REACTIONS: false,
		});
	} else {
		return;
	}
}
