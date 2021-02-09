import Command, { CommandRunner } from '@root/Command';
import { User } from 'discord.js';
import ClientDataSchema from '@models/clientData';

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
		if (!args[0]) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('❌ Block User Manager').setDescription("You have to mention a user or provide an user ID!"));
		let user: User;
		if (message.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
		if (args[0] && client.users.cache.filter(user => !user.bot).has(args[0])) user = client.users.cache.get(args[0]);
		if (!user) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
			.setTitle("❌ Block User Manager")
			.setDescription("You have to mention an user or provide an user ID!"));
		await ClientDataSchema.findById(client.dataSchemaObjectId, async (err: unknown, result: any) => {
			if (err) console.log(err);
			if (!result) return message.channel.send(client.createRedEmbed(true, commandUsage).setTitle('❌ Block User Manager')
				.setDescription(`I cannot find the client's data with the list of blocked users! Please try again!`));
			if (!result.blockedUser.includes(user.id) && !client.developers.includes(user.id) && !client.contributors.includes(user.id)) result.blockedUser.push(user.id);
			else if (client.developers.includes(user.id)) return message.channel.send(client.createRedEmbed(true, commandUsage)
				.setTitle('❌ Block User Manager')
				.setDescription(`${user} is a developer or a contributor! You don't have the permission to do this!`));
			else return message.channel.send(client.createRedEmbed(true, commandUsage)
				.setTitle('❌ Block User Manager')
				.setDescription(`${user} is already on the blacklisted bot user list!`));
			await ClientDataSchema.findByIdAndUpdate(client.dataSchemaObjectId, {
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