import Event, { EventRunner } from '@root/Event';
import { GuildMember } from 'discord.js';
import LevelSchema from '@root/Models/level';

export default class GuildMemberRemoveEvent extends Event {
	constructor() {
		super({
			name: "guildMemberRemove"
		});
	};
	run: EventRunner = async (client, member: GuildMember) => {
		await LevelSchema.findOneAndDelete({
			userID: member.id,
			guildID: member.guild.id
		});
	};
};