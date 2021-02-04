import Event from '@root/Event';
import { GuildMember } from 'discord.js';
import MessageSchema from '@models/messageCount';
import LevelSchema from '@models/levels';
import GalaxyAlpha from '@root/Client';

module.exports = class GuildMemberRemoveEvent extends Event {
	constructor(client) {
		super(client, {
			name: "guildMemberRemove"
		});
	};
	async run(client: GalaxyAlpha, member: GuildMember){
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