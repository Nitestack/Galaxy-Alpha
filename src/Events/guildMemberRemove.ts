import Event, { EventRunner } from '@root/Event';
import { GuildMember } from 'discord.js';
import MessageSchema from '@models/messageCount';
import LevelSchema from '@models/levels';

export default class GuildMemberRemoveEvent extends Event {
	constructor() {
		super({
			name: "guildMemberRemove"
		});
	};
	run: EventRunner = async (client, member: GuildMember) => {
		await MessageSchema.findOneAndDelete({
			messageGuildID: member.guild.id,
			messageUserID: member.id
		});
		await LevelSchema.findOneAndDelete({
			userID: member.id,
			guildID: member.guild.id
		});
	};
};