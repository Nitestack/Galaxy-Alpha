import Event, { EventRunner } from '@root/Event';
import { Guild, TextChannel } from 'discord.js';
import { Message } from 'discord.js';
import GuildSchema from '@models/guild';
import { Level } from "@models/level";

export default class MessageEvent extends Event {
	constructor() {
		super({
			name: 'message'
		});
	};
	run: EventRunner = async (client, message: Message) => {
		if (message.author.bot) return;
		if (message.channel.type != "dm" && !message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return (message.guild.channels.cache
			.filter(channel => channel.type == "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES"))
			.get(message.guild.systemChannel ? message.guild.systemChannelID : message.guild.channels.cache.filter(channel => channel.type == "text").first().id) as TextChannel).send(client.createRedEmbed()
				.setTitle("Client Manager")
				.setDescription("I need the permission `Send Messages`, `View Channels`, `Add Reactions`, `Use External Emojis`, `Read Message History` and `Embed Links` in every channel, where I should work!"));
		//PREFIX\\
		const settings = message.channel.type != "dm" ? await client.cache.getGuild(message.guild.id) : null;
		if (!settings && message.channel.type != "dm") {
			const newGuild = await GuildSchema.create({//adds the guild to the database file of prefixes
				guildID: message.guild.id,
				prefix: client.globalPrefix
			});
			newGuild.save().catch(err => console.log(err)); //saves the data and returns erros, if there are any
			client.cache.guilds.set(message.guild.id, newGuild);
		};
		//AFK\\
		if (client.afks.has(message.author.id)) {
			client.createSuccess(message, { title: "AFK Manager", description: `You're back! Removed AFK status! You were AFK for ${client.humanizer(message.createdTimestamp - client.afks.get(message.author.id).afkSince.getTime(), { round: true, units: ["y", "mo", "w", "d", "h", "m", "s"] })}!` })
			client.afks.delete(message.author.id);
		};
		if (client.afks.first()) client.afks.forEach(afk => {
			if (client.afks.has(afk.userID)) {
				message.channel.send(client.createRedEmbed()
					.setTitle("AFK Manager")
					.setDescription(`🌛 ${message.mentions.users.get(afk.userID)} is AFK since\n${client.util.dateFormatter(afk.afkSince)} (${client.humanizer(message.createdTimestamp - afk.afkSince.getTime(), { units: ["y", "mo", "w", "d", "h", "m", "s"], round: true })} ago)\n📝 **Reason:** ${afk.reason}`));
			};
		});
		//COMMAND OPTIONS\\
		const prefix: string = message.channel.type != 'dm' && settings?.prefix ? settings.prefix : client.globalPrefix; //if any datas of the guild exist, the prefix will be the custom prefix
		const prefixRegex: RegExp = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`); //Regular Expression to check if their is a bot mention
		let mentionPrefix: boolean;
		if (prefixRegex.test(message.content)) {
			mentionPrefix = true;
			if (message.mentions.users.has(client.user.id)) message.mentions.users.delete(client.user.id);
		} else mentionPrefix = false;
		if (!message.author.bot && message.channel.type != "dm") {
			const authorStats = await client.cache.getLevelandMessages(message.guild.id, message.author.id);
			const xp = authorStats.xp + parseInt((client.xpPerMessage as unknown as string), 10);
			const levelUp = xp >= (authorStats.level + 1) * (authorStats.level + 1) * 100;
			client.cache.levels.set(`${message.author.id}-${message.guild.id}`, ({
				...authorStats,
				messages: authorStats.messages + 1,
				xp: xp,
				level: levelUp ? authorStats.level + 1 : authorStats.level
			} as Level));
			if (levelUp) message.channel.send(client.createEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(`🎉 **Congratulations, ${message.author}! You have leveled up to Level ${(await client.cache.getLevelandMessages(message.guild.id, message.author.id)).level}!** 🎉\nCheck your level card with \`${prefix}level\`!`));
		};
		if (message.channel.type == "dm" && client.cache.getClientData().autoPublishChannels.includes(message.channel.id)) message.crosspost();
		/*if (!client.developers.includes(message.author.id) && !client.contributors.includes(message.author.id)) {
			if (message.content.includes('discord.gg/')) {
				const isOurInvite = await this.isInvite(message.guild, message.content.split('discord.gg/')[1]);
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
		};*/
		const [, matchedPrefix] = mentionPrefix ? message.content.match(prefixRegex) : prefix;
		if (!message.content.startsWith(mentionPrefix ? matchedPrefix : prefix)) return;
		const [cmd, ...args]: Array<string> | string = message.content.slice(mentionPrefix ? matchedPrefix.length : prefix.length).trim().split(/\s+/g); //destructures the command of the message
		if (cmd.toLowerCase() == "modmail") return client.emit('modMail', message);
		const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
		if (!command) return;
		//OWNER COMMANDS\\
		if (command.ownerOnly && message.author.id != client.ownerID) return;
		//DEVELOPER COMMANDS\\
		if (command.developerOnly && !client.developers.includes(message.author.id)) return;
		//GUILD COMMANDS\\
		if (command.guildOnly && message.channel.type == 'dm') return message.author.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use the command \`${command.name}\` inside a server!`));
		//DM COMMANDS\\
		if (command.dmOnly && message.channel.type != 'dm') return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use the command \`${command.name}\` inside DM's!`));
		//NSFW COMMANDS\\
		if (command.nsfw && message.channel.type != "dm" && !message.channel.nsfw) return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use nsfw commands like \`${command.name}\` in DM's or nsfw channels!`));
		//NEWS CHANNEL COMMANDS\\
		if (command.newsChannelOnly && message.channel.type != "news") return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use commands like \`${command.name}\` in announcement channels!`));
		if (command.textChannelOnly && message.channel.type != "text") return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle("Channel Manager")
			.setDescription(`You can only use commands like \`${command.name}\` in text channels!`));
		//BLOCKED USERS\\
		if (client.cache.getClientData().blockedUser.includes(message.author.id)) return message.channel.send(client.createEmbed()
			.setTitle('Client Manager')
			.setDescription(`You are blacklisted from using any commands of ${client.user.username}!
			If you want to be whitelisted, please [join this link](https://discord.gg/X6YYfZMQeX) to get whitelisted!
			Any questions about the process etc. will be answered there!`));
		//USER PERMISSIONS\\
		if (message.channel.type != "dm" && command.userPermissions) {
			let perms: number = 0;
			for (const permission of command.userPermissions) if (message.channel.permissionsFor(message.author).has(permission)) perms++;
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
		//CLIENT PERMISSIONS\\
		if (message.channel.type != "dm" && command.clientPermissions) {
			let perms: number = 0;
			for (const permission of command.clientPermissions) if (message.channel.permissionsFor(client.user).has(permission)) perms++;
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
		//COOLDOWN CHECKER\\
		if (client.cooldowns.has(`${message.author.id}-${command.name}`)) return message.channel.send(client.createRedEmbed(true, `${prefix}${command.usage}`)
			.setTitle('🕐 Cooldown Manager')
			.setDescription(`You are on a cooldown!\nYou have to wait ${client.humanizer(client.cooldowns.get(`${message.author.id}-${command.name}`) - message.createdTimestamp, { units: ["mo", "w", "d", "h", "m", "s"], round: true })}`));
		//COMMAND RUNNER\\
		try {
			command.run(client, message, args, prefix);
		} catch (error) {
			if (error && client.developers.includes(message.author.id)) {
				message.channel.send(client.createRedEmbed()
					.setTitle("ERROR")
					.setDescription(`${error}`));
				console.log(error);
			};
		};
		//COOLDOWN\\
		if (message.channel.type == "dm" ? !client.developers.includes(message.author.id) : message.guild.id == client.supportGuild.id ? !client.developers.includes(message.author.id) : true) {
			client.cooldowns.set(`${message.author.id}-${command.name}`, message.createdTimestamp + client.ms(command.cooldown));
			setTimeout(() => {
				client.cooldowns.delete(`${message.author.id}-${command.name}`);
			}, client.ms(command.cooldown));
			return;
		};
	};
	async isInvite(guild: Guild, code: string): Promise<boolean> {
		return await new Promise(resolve => {
			guild.fetchInvites().then(invites => {
				for (const invite of invites) if (code === invite[0]) return resolve(true);
				resolve(false);
			});
		});
	};
};