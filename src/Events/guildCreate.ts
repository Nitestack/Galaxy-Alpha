import mongoose from 'mongoose';
import GuildSchema from '@models/guild';
import { Guild } from 'discord.js';
import Event from '@root/Event';
import GalaxyAlpha from '@root/Client';

module.exports = class GuildCreateEvent extends Event {
	constructor(client) {
		super(client, {
			name: "guildCreate"
		});
	};
	async run(client: GalaxyAlpha, guild: Guild) {
		const newGuild = new GuildSchema({
			_id: mongoose.Types.ObjectId(),
			guildID: guild.id,
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
			welcomeEmbed: false
		});
		return newGuild.save().catch((err: unknown) => console.error(err));
	};
};