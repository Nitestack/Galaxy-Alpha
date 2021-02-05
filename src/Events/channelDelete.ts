import Event, { EventRunner } from '@root/Event';
import { DMChannel, GuildChannel } from 'discord.js';
import GuildSchema from '@models/guild';
import autoPublishSchema from '@models/clientData';
import TicketSchema from '@models/ticket';
import ModLogsSchema from '@models/modlogs';
import CounterSchema from '@models/counter';

export default class ChannelDeleteEvent extends Event {
	constructor() {
		super({
			name: "channelDelete"
		});
	};
	run: EventRunner = async (client, channel: DMChannel | GuildChannel) => {
		if (channel.type == 'category') {
			GuildSchema.findOne({
				ticketCategoryID: channel.id
			}, {}, {}, (err, guild) => {
				if (err) return console.log(err);
				if (!guild || !guild.ticketCategoryID) return;
				GuildSchema.findOneAndUpdate({
					guildID: channel.guild.id
				}, {
					ticketCategoryID: null
				}, {
					upsert: false
				});
				return;
			});
		} else if (channel.type != 'voice') {
			await autoPublishSchema.findById(client.dataSchemaObjectId, (err: unknown, result: any) => {
				if (err) {
					return console.log(err);
				} else if (result) {
					if (result.autoPublishChannels.includes(channel.id)) {
						//if the channel is in the list of auto publish channels
						result.autoPublishChannels.splice(result.autoPublishChannels.indexOf(channel.id), 1);
						return autoPublishSchema
							.findByIdAndUpdate(client.dataSchemaObjectId, {
								autoPublishChannels: result.autoPublishChannels,
							}, {
								upsert: false,
							}, (err: unknown) => {
								if (err) {
									return console.log(err);
								} else {
									return;
								}
							}).exec().catch((err: unknown) => console.log(err));
					} else if (result.autoPollChannels.includes(channel.id)) {
						//if the channel is in the list of auto publish channels
						result.autoPollChannels.splice(result.autoPollChannels.indexOf(channel.id), 1);
						return autoPublishSchema
							.findByIdAndUpdate(client.dataSchemaObjectId, {
								autoPollChannels: result.autoPollChannels,
							}, {
								upsert: false,
							}, (err: unknown) => {
								if (err) {
									return console.log(err);
								} else {
									return;
								};
							}).exec().catch((err: unknown) => console.log(err));
					} else {
						return;
					}
				}
			});
			await GuildSchema.findOne({
				guildID: (channel as GuildChannel).guild.id
			}, {}, {}, async (err, guild) => {
				if (err) return console.log(err);
				if (!guild) return;
				if (guild.logChannelID == channel.id) {
					await GuildSchema.findOneAndUpdate({
						guildID: (channel as GuildChannel).guild.id
					}, {
						logChannelID: null
					}, {
						upsert: false
					});
				} else if (guild.welcomeChannelID == channel.id) {
					await GuildSchema.findOneAndUpdate({
						guildID: (channel as GuildChannel).guild.id
					}, {
						welcomeChannelID: null
					}, {
						upsert: false
					});
				} else {
					return;
				};
			});
			await TicketSchema.findOne({
				guildID: (channel as GuildChannel).guild.id
			}, {}, {}, async (err, ticket) => {
				if (err) return console.log(err);
				if (!ticket) return;
				if (ticket.channelID == channel.id) {
					await TicketSchema.findOneAndDelete({
						channelID: channel.id
					});
				} else {
					return;
				};
			});
			await ModLogsSchema.findOne({
				channelID: channel.id
			}, {}, {}, async (err, modlogs) => {
				if (err) return console.log(err);
				if (!modlogs) return;
				await ModLogsSchema.findOneAndDelete({
					channelID: channel.id
				});
			});
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