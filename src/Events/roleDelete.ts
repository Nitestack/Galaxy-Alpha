import Guild from '@models/guild';
import Event, { EventRunner } from '@root/Event';
import { Role } from 'discord.js';

export default class RoleDeleteEvent extends Event {
	constructor() {
		super({
			name: "roleDelete"
		});
	};
	run: EventRunner = async (client, role: Role) => {
		const guild = await Guild.findOne({
			guildID: role.guild.id,
		}, {}, {}, (err: unknown, guild) => {
			if (err) console.log(err);
			if (!guild || (!guild.muteRoleID && !guild.memberRoleID)) return;
		});
		if (guild) {
			if (guild.muteRoleID == role.id) {
				await Guild.findOneAndUpdate({
					guildID: role.guild.id,
				}, {
					muteRole: null,
				}, {
					upsert: false,
				}).catch(err => console.log(err));
			} else if (guild.memberRoleID == role.id) {
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
