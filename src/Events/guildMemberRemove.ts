import Event from '@root/Event';
import { Guild, GuildMember, MessageEmbed } from 'discord.js';
import MessageSchema from '@models/messageCount';
import LevelSchema from '@models/levels';

module.exports = class GuildMemberRemoveEvent extends Event {
	constructor(client) {
		super(client, {
			name: "guildMemberRemove"
		});
	};
	async run(client, member: GuildMember){
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