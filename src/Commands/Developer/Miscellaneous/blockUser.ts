import Command from '@root/Command';
import { User } from 'discord.js';
import clientData from '@models/clientData';

module.exports = class BlockUserCommand extends Command {
	constructor(client) {
		super(client, {
			name: "blockuser",
			description: "blocks an user from using any commands",
			category: "developer",
			usage: "blockuser <@User/User ID>",
			developerOnly: true
		});
	};
	async run(client, message, args, prefix) {
		const commandUsage = `${prefix}${this.usage}`;
		if (!args[0]) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('❌ Block User Manager').setDescription("You have to mention a user or provide an user ID!"));
		let user: User;
		if (message.mentions.users.first()) user = message.mentions.users.first();
		if (args[0] && client.users.cache.filter(user => !user.bot).get(args[0])) user = client.users.cache.filter(user => !user.bot).get(args[0]);
		await clientData.findById(client.dataSchemaObjectId, async (err: unknown, result: any) => {
			if (err) console.log(err);
			if (!result) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('❌ Block User Manager')
				.setDescription(`I cannot find the client's data with the list of blocked users! Please try again!`));
			if (user) {
				if (!result.blockedUser.includes(user.id) && !client.developers.includes(user.id) && !client.contributors.includes(user.id)) {
					result.blockedUser.push(user.id);
				} else if (client.developers.includes(user.id)) {
					return message.channel.send(client.createRedEmbed(true, commandUsage)
						.setTitle('❌ Block User Manager')
						.setDescription(`${user} is a developer or a contributor! You don't have the permission to do this!`));
				} else {
					return message.channel.send(client.createRedEmbed(true, commandUsage)
						.setTitle('❌ Block User Manager')
						.setDescription(`${user} is already on the blacklisted bot user list!`));
				};
			} else {
				return message.channel.send(client.createRedEmbed(true, commandUsage)
					.setTitle('❌ Block User Manager')
					.setDescription(`Cannot find the user with the ID \`${user.id}\`!`));
			};
			await clientData.findByIdAndUpdate(client.dataSchemaObjectId, {
				blockedUser: result.blockedUser
			}, {
				upsert: false
			}).exec().catch(err => console.log(err));
			return message.channel.send(client.createGreenEmbed()
				.setTitle('❌ Block User Manager')
				.setDescription(`Successfully added ${user} to the blacklist!`));
		});
	};
};