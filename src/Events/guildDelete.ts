import GuildSchema from '@models/guild';
import { Guild } from 'discord.js';
import Event from '@root/Event';
import GalaxyAlpha from '@root/Client';

export default class GuildDeleteEvent extends Event {
	constructor() {
		super({
			name: "guildDelete"
		});
	};
	async run(client: GalaxyAlpha, guild: Guild) {
		GuildSchema.findOneAndDelete({
			guildID: guild.id
		});
	};
};