import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';

export default class BlockUserCommand extends Command {
	constructor() {
		super({
			name: "blockuser",
			description: "blocks an user from using any commands",
			category: "developer",
			usage: "blockuser <@User/User ID>",
			developerOnly: true,
			args: [{
				type: "realUser",
				required: true,
				errorMessage: "You have to mention an user or provide an user ID!",
				errorTitle: "❌ Block User Manager"
			}]
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		const manager = "❌ Block User Manager";
		const user = args[0];
		const clientData = client.cache.getClientData();
		if (client.developers.includes(user.id) || client.contributors.includes(user.id)) return client.createArgumentError(message, { title: manager, description: `${user} is a developer or a contributor! You don't have the permission to do this!` }, this.usage);
		if (clientData.blockedUser.includes(user.id)) return client.createArgumentError(message, { title: manager, description: `${user} is already on the blacklisted bot user list!`}, this.usage);
		client.cache.clientData.blockedUser.push(user.id);
		return client.createSuccess(message, { title: manager, description: `Successfully added ${user} to the blacklist!` });
	};
};