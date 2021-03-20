import Event, { EventRunner } from '@root/Event';
import { Role } from 'discord.js';

export default class RoleDeleteEvent extends Event {
	constructor() {
		super({
			name: "roleDelete"
		});
	};
	run: EventRunner = async (client, role: Role) => {
		const guildSettings = await client.cache.getGuild(role.guild.id);
		for (const reactionRole of guildSettings.reactionRoles){
			if (Object.values(reactionRole).includes(role.id)){
				guildSettings.reactionRoles.splice(guildSettings.reactionRoles.indexOf(reactionRole), 1);
			};
		};
		if (Object.values(guildSettings).includes(role.id)){
			
		};
	};
};
