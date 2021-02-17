import Event, { EventRunner } from '@root/Event';
import { DMChannel, GuildChannel } from 'discord.js';
import { Guild } from '@models/guild';
import TicketSchema from '@models/ticket';
import CounterSchema from '@models/counter';

export default class ChannelDeleteEvent extends Event {
	constructor() {
		super({
			name: "channelDelete"
		});
	};
	run: EventRunner = async (client, channel: DMChannel | GuildChannel) => {
		if (channel.type == 'category') {
			const ticketCategory = await client.cache.getGuild(channel.guild.id);
			if (ticketCategory.ticketCategoryID == channel.id) client.cache.guilds.set(channel.guild.id, ({
				...ticketCategory,
				ticketCategoryID: null
			} as Guild));
		} else if (channel.type != 'voice') {
			const autoPublishSchema = client.cache.getClientData();
			if (autoPublishSchema.autoPublishChannels.includes(channel.id)) autoPublishSchema.autoPublishChannels.splice(autoPublishSchema.autoPublishChannels.findIndex(autoChannel => autoChannel == channel.id), 1);
			const ticket = await TicketSchema.findOne({ channelID: channel.id });
			if (ticket) await TicketSchema.findOneAndDelete({ channelID: channel.id });
		} else {
			await CounterSchema.findOne({
				guildID: channel.guild.id
			}, {}, {}, async (err, counter) => {
				if (err) return console.log(err);
				if (!counter) return;
				if (counter.allMembers == channel.id) await CounterSchema.findOneAndUpdate({ allMembers: channel.id }, { allMembers: undefined }, { upsert: false });
				if (counter.members == channel.id) await CounterSchema.findOneAndUpdate({ members: channel.id }, { members: undefined }, { upsert: false });
				if (counter.bots == channel.id) await CounterSchema.findOneAndUpdate({ bots: channel.id }, { bots: undefined }, { upsert: false });
				if (counter.roles == channel.id) await CounterSchema.findOneAndUpdate({ roles: channel.id }, { roles: undefined }, { upsert: false });
				if (counter.allChannels == channel.id) await CounterSchema.findOneAndUpdate({ allChannels: channel.id }, { allChannels: undefined }, { upsert: false });
				if (counter.textChannels == channel.id) await CounterSchema.findOneAndUpdate({ textChannels: channel.id }, { textChannels: undefined }, { upsert: false });
				if (counter.voiceChannels == channel.id) await CounterSchema.findOneAndUpdate({ voiceChannels: channel.id }, { voiceChannels: undefined }, { upsert: false });
				if (counter.categories == channel.id) await CounterSchema.findOneAndUpdate({ categories: channel.id }, { categories: undefined }, { upsert: false });
				if (counter.announcements == channel.id) await CounterSchema.findOneAndUpdate({ announcements: channel.id }, { announcements: undefined }, { upsert: false });
				if (counter.allEmojis == channel.id) await CounterSchema.findOneAndUpdate({ allEmojis: channel.id }, { allEmojis: undefined }, { upsert: false });
				if (counter.animated == channel.id) await CounterSchema.findOneAndUpdate({ animated: channel.id }, { animated: undefined }, { upsert: false });
				if (counter.notAnimated == channel.id) await CounterSchema.findOneAndUpdate({ notAnimated: channel.id }, { notAnimated: undefined }, { upsert: false });
				if (counter.boosts == channel.id) await CounterSchema.findOneAndUpdate({ boosts: channel.id }, { boosts: undefined }, { upsert: false });
				if (counter.boostLevel == channel.id) await CounterSchema.findOneAndUpdate({ boostLevel: channel.id }, { boostLevel: undefined }, { upsert: false });
			});
		};
	};
};