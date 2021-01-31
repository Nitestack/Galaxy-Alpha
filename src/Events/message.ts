import mongoose from 'mongoose';
import Command from "@root/Command";
import duration from 'humanize-duration'
import Event from '@root/Event';
import { Guild, MessageEmbed } from 'discord.js';
import { Message } from 'discord.js';
import Levels from 'discord-xp';
import autoPublishSchema from '@root/Models/clientData';
import MessageCount from '@models/messageCount';
import GuildSchema from '@models/guild';
import GalaxyAlpha from '@root/Client';

module.exports = class MessageEvent extends Event {
	constructor(client) {
		super(client, {
			name: 'message'
		});
	};
	async run(client: GalaxyAlpha, message: Message) {
		if (message.author.bot) return;
		if (message.channel.type != "dm" && !message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return message.guild.channels.cache
			.filter(channel => channel.type == "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES"))
			.get(message.guild.systemChannel ? message.guild.systemChannelID : message.guild.channels.cache.filter(channel => channel.type == "text").first().id).send(client.createRedEmbed()
				.setTitle("Client Manager")
				.setDescription("I need the permission `Send Messages`, `View Channels`, `Add Reactions`, `Use External Emojis`, `Read Message History` and `Embed Links` in every channel, where I should work!\nFor the mute function I need the permission `Manage Channels` to overwrite the permission in every channel!"));
		//PREFIX\\
		const settings = await GuildSchema.findOne({//searches for the guild in the database
			guildID: message.channel.type != 'dm' ? message.guild.id : null, //guild id
		}, (err: unknown, guild: any) => {//if an error occurred or the guild doesn't exist
			if (err) return console.log(err); //logs the error in the console
			if (!guild && message.channel.type != 'dm') {//if the guild doesn't exist
				const newGuild = new GuildSchema({//adds the guild to the database file of prefixes
					_id: mongoose.Types.ObjectId(), //object id
					guildID: message.guild.id,
					guildPrefix: client.globalPrefix,
					logChannelID: null,
					guildShardID: message.guild.shardID,
					muteRole: null,
					memberRole: null,
					ticketCategory: null,
					ticketRole: null,
					giveawayByPass: null,
					giveawayBlackListed: null,
					giveawayPing: null,
					welcomeMessage: null,
					welcomeEmbed: false
				});
				return newGuild.save().catch(err => console.log(err)); //saves the data and returns erros, if there are any
			};
		});
		//COMMAND OPTIONS\\
		const prefix: string = settings && message.channel.type != 'dm' && settings.guildPrefix ? settings.guildPrefix : client.globalPrefix; //if any datas of the guild exist, the prefix will be the custom prefix
		const prefixRegex: RegExp = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`); //Regular Expression to check if their is a bot mention
		let mentionPrefix: Boolean;
		if (prefixRegex.test(message.content)) {
			mentionPrefix = true;
		} else {
			mentionPrefix = false;
		};
		autoPublishSchema.findById(client.dataSchemaObjectId, (err: unknown, result: any) => {
			if (err) {
				if (client.developers.includes(message.author.id)) {
					return message.channel.send(
						client.createRedEmbed().setTitle('ERROR').setDescription(`${err}`));
				} else {
					return message.channel.send(
						client.createRedEmbed()
							.setTitle('Auto Publish Manager')
							.setDescription('An error occurred while you send a message in this channel! Please try again!'));
				}
			} else if (result) {
				if (result.autoPublishChannels.includes(message.channel.id)) {
					//if the channel is in the list of auto publish channels
					return message.crosspost(); //auto post the message
				};
			};
		});
		if (!client.developers.includes(message.author.id) && !client.contributors.includes(message.author.id)) {
			if (message.content.includes('discord.gg/')) {
				const isOurInvite = await isInvite(message.guild, message.content.split('discord.gg/')[1]);
				if (!isOurInvite) {
					message.delete();
					const embed = client.createRedEmbed()
						.setAuthor(`${message.author.username} sent an invite link!`, message.author.displayAvatarURL())
						.setDescription("You're not allowed to advertise here!");
					return message.channel.send(embed).then((embed) => {
						embed.delete({ timeout: 10000 });
					});
				};
			};
		};
		if (!message.author.bot && message.channel.type != 'dm') {
			if (client.cache.messages.has(`${message.author.id}-${message.guild.id}`)) {
				client.cache.messages.set(`${message.author.id}-${message.guild.id}`, {
					userID: message.author.id,
					guildID: message.guild.id,
					messageCount: client.cache.messages.get(`${message.author.id}-${message.guild.id}`).messageCount + 1
				});
			} else {
				await MessageCount.findOne({
					messageUserID: message.author.id,
					messageGuildID: message.guild.id
				}, {}, {}, (err, messageProfile) => {
					if (err) return console.log(err);
					if (!messageProfile) client.cache.messages.set(`${message.author.id}-${message.guild.id}`, {
						userID: message.author.id,
						guildID: message.guild.id,
						messageCount: 1
					});
					else if (messageProfile) client.cache.messages.set(`${message.author.id}-${message.guild.id}`, {
						userID: message.author.id,
						guildID: message.guild.id,
						messageCount: messageProfile.messageCount + 1
					});
				});
			};
		};
		const [, matchedPrefix] = mentionPrefix ? message.content.match(prefixRegex) : prefix;
		if (!message.content.startsWith(mentionPrefix ? matchedPrefix : prefix)) return;
		const [usedCommand, ...args]: Array<string> | string = message.content.slice(mentionPrefix ? matchedPrefix.length : prefix.length).trim().split(/ +/g); //destructures the command of the message
		if (usedCommand.toLowerCase() == "modmail") {
			return client.emit('modMail', message);
		};
		const command: Command = client.commands.get(usedCommand.toLowerCase()) || client.commands.get(client.aliases.get(usedCommand.toLowerCase()));
		if (!command) return;
		if (command.ownerOnly && message.author.id != client.ownerID) return;
		if (command.developerOnly && !client.developers.includes(message.author.id)) return;
		if (command.guildOnly && message.channel.type == 'dm') return message.author.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use the command \`${command.name}\` inside a server!`));
		if (command.dmOnly && message.channel.type != 'dm') return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use the command \`${command.name}\` inside DM's!`));
		if (command.nsfw && message.channel.type != "dm" && !message.channel.nsfw) return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use nsfw commands like \`${command.name}\` in DM's or nsfw channels!`));
		autoPublishSchema.findById(client.dataSchemaObjectId, async (err, result) => {
			if (err) return console.log(err);
			if (result.blockedUser.includes(message.author.id) && command) {
				message.delete();
				const embed: MessageEmbed = client.createEmbed()
					.setTitle('Client Manager')
					.setDescription(`You are blacklisted from using any commands of ${client.user.username}!
					If you want to be whitelisted, please [join this link](https://discord.gg/X6YYfZMQeX) to get whitelisted!
					Any questions about the process etc. will be answered there!`).addField('Additional Links', `[Join Galaxy Alpha](https://discord.gg/qvbFn6bXQX)\n[Invite Galaxy Alpha](${client.inviteLink})`);
				return message.channel.send(embed).then((msg) => {
					msg.delete({ timeout: 30000 });
				});
			} else {
				if (message.channel.type != 'dm') {
					//LEVEL\\
					const randomAmountOfXp: Number = Math.floor(Math.random() * 29) + 1;
					const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
					if (hasLeveledUp) {
						const user = await Levels.fetch(message.author.id, message.guild.id);
						const levelUpMessage: MessageEmbed = client.createEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL())
							.setDescription(`🎉 **Congratulations, ${message.author}! You have leveled up to Level ${user.level}!** 🎉`);
						message.channel.send(levelUpMessage);
					};
					if (command.userPermissions) {
						let perms: number = 0;
						for (const permission of command.userPermissions) if (message.member.hasPermission(permission)) perms++;
						if (perms == 0) {
							let userPerms: Array<string> = [];
							command.userPermissions.forEach(perm => {
								userPerms.push(client.permissionsShowCase[client.permissions.indexOf(perm)]);
							});
							return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
								.setTitle("Permission Manager")
								.setDescription(`You need one of the following permissions to use the command \`${command.name}\`:\n\`${userPerms.join("`, `")}\``));
						};
					};
					if (command.clientPermissions) {
						let perms: number = 0;
						for (const permission of command.clientPermissions) if (message.guild.me.hasPermission(permission)) perms++;
						if (perms == 0) {
							let clientPerms: Array<string> = [];
							command.clientPermissions.forEach(perm => {
								clientPerms.push(client.permissionsShowCase[client.permissions.indexOf(perm)]);
							});
							return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
								.setTitle("Permission Manager")
								.setDescription(`I need one of the following permissions to use the command \`${command.name}\`: \n\`${clientPerms.join("`, `")}\``));
						};
					};
				};
				//COOLDOWN CHECKER\\
				const cooldownTimestamp = duration(client.cooldowns.get(`${message.author.id}-${command.name}`) - message.createdTimestamp, {
					units: ["mo", "w", "d", "h", "m", "s"],
					round: true
				});
				if (client.cooldowns.has(`${message.author.id}-${command.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
					.setTitle('🕐 Cooldown Manager')
					.setDescription(`You are on a cooldown!\nYou have to wait ${cooldownTimestamp}`));
				//COMMAND RUNNER\\
				command.run(client, message, args, prefix).catch((error: unknown) => {
					if (error && client.developers.includes(message.author.id)) message.channel.send(client.createRedEmbed()
						.setTitle("ERROR")
						.setDescription(`${error}`));
				});
				client.cooldowns.set(`${message.author.id}-${command.name}`, message.createdTimestamp + (command.cooldown * 1000));
				setTimeout(() => {
					client.cooldowns.delete(`${message.author.id}-${command.name}`);
				}, command.cooldown * 1000);
				return;
			};
		});
	};
};

async function isInvite(guild: Guild, code: string) {
	return await new Promise((resolve) => {
		guild.fetchInvites().then(invites => {
			for (const invite of invites) {
				if (code === invite[0]) {
					return resolve(true);
				};
			};
			resolve(false);
		});
	});
};