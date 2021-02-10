import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';
import { ClientData } from "@models/clientData";

export default class BlockUserCommand extends Command {
	constructor() {
		super({
			name: "blockuser",
			description: "blocks an user from using any commands",
			category: "developer",
			usage: "blockuser <@User/User ID>",
			developerOnly: true
		});
	};
	run: CommandRunner = async (client, message, args, prefix) => {
		const commandUsage = `${prefix}${this.usage}`;
		const manager = "❌ Block User Manager";
		let user: User;
		if (message.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
		if (args[0] && client.users.cache.filter(user => !user.bot).has(args[0])) user = client.users.cache.get(args[0]);
		if (!user) client.createArgumentError(message, { title: manager, description: "You have to mention an user or provide an user ID!" }, this.usage);
		const result = client.cache.getClientData();
		const blockedUser = result.blockedUser;
		if (!blockedUser.includes(user.id) && !client.developers.includes(user.id) && !client.contributors.includes(user.id)) blockedUser.push(user.id);
		else if (client.developers.includes(user.id)) return client.createArgumentError(message, { title: manager, description: `${user} is a developer or a contributor! You don't have the permission to do this!` }, this.usage);
		else return client.createArgumentError(message, { title: manager, description: `${user} is already on the blacklisted bot user list!`}, this.usage);
		client.cache.clientData = ({
			autoPollChannels: result.autoPollChannels,
			autoPublishChannels: result.autoPublishChannels,
			blockedUser: blockedUser
		} as ClientData);
		client.cache.clearCacheAndSave();
		return client.createSuccess(message, { title: manager, description: `Successfully added ${user} to the blacklist!` });
	};
};