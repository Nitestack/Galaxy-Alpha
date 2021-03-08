import GuildSchema from '@models/guild';
import { Guild } from 'discord.js';
import Event, { EventRunner } from '@root/Event';

export default class GuildDeleteEvent extends Event {
	constructor() {
		super({
			name: "guildDelete"
		});
	};
	run: EventRunner = async (client, guild: Guild) => {
		GuildSchema.findOneAndDelete({
			guildID: guild.id
		});
		client.cache.guilds.delete(guild.id);
	};
};