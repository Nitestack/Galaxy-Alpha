import GuildSchema from '@models/guild';
import { Guild } from 'discord.js';
import Event from '@root/Event';
import GalaxyAlpha from '@root/Client';

module.exports = class GuildDeleteEvent extends Event {
	constructor(client) {
		super(client, {
			name: "guildDelete"
		});
	};
	async run(client: GalaxyAlpha, guild: Guild) {
		GuildSchema.findOneAndDelete({
			guildID: guild.id
		});
	};
};