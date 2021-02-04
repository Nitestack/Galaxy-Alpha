import Guild from '@models/guild';
import GalaxyAlpha from '@root/Client';
import Event from '@root/Event';
import { Role } from 'discord.js';

module.exports = class RoleDeleteEvent extends Event {
	constructor(client) {
		super(client, {
			name: "roleDelete"
		});
	};
	async run(client: GalaxyAlpha, role: Role) {
		const guild = await Guild.findOne({
			guildID: role.guild.id,
		}, {}, {}, (err: unknown, guild) => {
			if (err) console.log(err);
			if (!guild || (!guild.muteRole && !guild.memberRole)) return;
		});
		if (guild) {
			if (guild.muteRole == role.id) {
				await Guild.findOneAndUpdate({
					guildID: role.guild.id,
				}, {
					muteRole: null,
				}, {
					upsert: false,
				}).catch(err => console.log(err));
			} else if (guild.memberRole == role.id) {
				await Guild.findOneAndUpdate({
					guildID: role.guild.id,
				}, {
					memberRole: null,
				}, {
					upsert: false,
				}).catch((err) => console.log(err));
			} else {
				return;
			}
		};
	};
};
