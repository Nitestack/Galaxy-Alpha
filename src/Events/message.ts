import GalaxyAlpha from '@root/Client';
import Command, { SubCommand } from '@root/Command';
import Event, { EventRunner } from '@root/Event';
import { Guild, GuildMember, NewsChannel, PermissionString, Role, TextChannel, Message } from 'discord.js';
import leven from 'leven';

export default class MessageEvent extends Event {
	constructor() {
		super({
			name: "message"
		});
	};
	run: EventRunner = async (client, message: Message) => {
		if (message.author.bot) return;
		if (message.channel.type != "dm" && (await client.cache.getGuild(message.guild.id)).ignoreChannels.includes(message.channel.id)) return;
		if (message.channel.type != "dm" && !message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return (message.guild.channels.cache
			.filter(channel => channel.type == "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES"))
			.get(message.guild.systemChannel ? message.guild.systemChannelID : message.guild.channels.cache.filter(channel => channel.type == "text").first().id) as TextChannel).send(client.createRedEmbed()
				.setTitle("Client Manager")
				.setDescription("I need the permission `Send Messages`, `View Channels`, `Add Reactions`, `Use External Emojis`, `Read Message History` and `Embed Links` in every channel, where I should work!"));
		//AFK\\
		if (client.afks.has(message.author.id)) {
			client.createSuccess(message, { title: "AFK Manager", description: `You're back! Removed AFK status! You were AFK for ${client.humanizer(message.createdTimestamp - client.afks.get(message.author.id).afkSince.getTime(), { round: true, units: ["y", "mo", "w", "d", "h", "m", "s"] })}!` })
			client.afks.delete(message.author.id);
		};
		if (client.afks.first()) client.afks.forEach(afk => {
			if (message.mentions.users.has(afk.userID)) {
				message.channel.send(client.createRedEmbed()
					.setTitle("AFK Manager")
					.setDescription(`🌛 ${message.mentions.users.get(afk.userID)} is AFK since\n${client.util.dateFormatter(afk.afkSince)} (${client.humanizer(message.createdTimestamp - afk.afkSince.getTime(), { units: ["y", "mo", "w", "d", "h", "m", "s"], round: true })} ago)\n📝 **Reason:** ${afk.reason}`));
			};
		});
		//COMMAND OPTIONS\\
		let prefix: string = message.channel.type != 'dm' && (await client.cache.getGuild(message.guild.id)).prefix ? (await client.cache.getGuild(message.guild.id)).prefix : client.globalPrefix; //if any datas of the guild exist, the prefix will be the custom prefix
		const prefixRegex: RegExp = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`); //Regular Expression to check if their is a bot mention
		let mentionPrefix: boolean;
		if (prefixRegex.test(message.content)) {
			mentionPrefix = true;
			const [, matchedPrefix] = message.content.match(prefixRegex);
			prefix = matchedPrefix;
			if (message.mentions.users.first()?.id == client.user.id) message.mentions.users.delete(message.mentions.users.first().id);
		} else mentionPrefix = false;
		if (message.channel.type != "dm") {
			const authorStats = await client.cache.getLevelandMessages(message.guild.id, message.author.id);
			const levelUp = authorStats.xp + client.xpPerMessage >= (authorStats.level + 1) * (authorStats.level + 1) * 100;
			authorStats.xp += client.xpPerMessage;
			authorStats.messages++;
			authorStats.lastUpdated = message.createdAt;
			if (levelUp) {
				authorStats.level++;
				message.channel.send(client.createEmbed()
					.setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(`🎉 **Congratulations, ${message.author}! You have leveled up to Level ${authorStats.level}!** 🎉\nCheck your level card with \`${prefix}level\`!`));
			};
		};
		if (message.channel.type != "dm" && (await client.cache.getGuild(message.guild.id)).autoPublishChannels.includes(message.channel.id)) message.crosspost();
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
		if (message.channel.type != "dm" && (await client.cache.getGuild(message.guild.id)).autoSuggestionChannel.includes(message.channel.id)) {
			await message.react("👍");
			await message.react("👎");
		};
		if (message.channel.id == "817379995102085140" && !message.content.startsWith(prefix + "eval")) message.delete();
		if (message.channel.type != "dm") {
			const customCommand = await client.cache.getCustomCommand(message.guild.id, message.content.toLowerCase());
			if (customCommand) {
				return message.channel.send(customCommand.answers[client.util.getRandomArbitrary(0, customCommand.answers.length - 1)]);
			};
		};
		if (!message.content.startsWith(prefix)) return;
		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/\s+/g); //destructures the command of the message
		if (cmd.toLowerCase() == "modmail") return;
		const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()));
		if (!command || (client.disabledCommands.has(command ? command.name : cmd.toLowerCase()) && !client.developers.includes(message.author.id))) {
			const best = [...client.commands.filter(c => !c.developerOnly && c.category != "developer" && c.category != "private" && !client.disabledCommands.has(c.name)).map(cmd => cmd.name), ...client.aliases.filter(alias => {
				const c = client.commands.get(alias);
				if (!c) return false;
				return !c.developerOnly && c.category != "developer" && c.category != "private" && !client.disabledCommands.has(c.name);
			}).map(alias => `${alias}`)].filter((c, index, array) => array.indexOf(c) == index && leven(cmd.toLowerCase(), c.toLowerCase()) < c.length * 0.4);
			const dym = best.length == 0 ? "" : best.length == 1 ? `Did you mean **${best[0]}** ?` : `Did you mean\n${best.map(value => `**${value}**`).join("\n")}\n?`;
			return message.channel.send(client.createRedEmbed()
				.setTitle("📟 Command Manager")
				.setDescription(`Cannot find the command \`${cmd}\`!\n${dym}\nPlease try again!`));
		};
		//BLOCKED USERS\\
		if (client.cache.getClientData().blockedUser.includes(message.author.id)) return message.channel.send(client.createEmbed()
			.setTitle('Client Manager')
			.setDescription(`You are blacklisted from using any commands of ${client.user.username}!
			If you want to be whitelisted, please [join this link](https://discord.gg/X6YYfZMQeX) to get whitelisted!
			Any questions about the process etc. will be answered there!`));
		if (command && command.category != "private") await (client.supportGuild.channels.cache.get("819285259974737960") as TextChannel | NewsChannel).send(`**${message.author.tag}** used command **${command.name}** in **${message.guild ? message.guild.name : "DM's"}**!`);
		if (command.subCommands) {
			for (const subCommand of command.subCommands) {
				const commandHandler = await this.handleCommand(client, message, subCommand, message.channel.type == "dm" ? client.globalPrefix : prefix, command.usage);
				if (!commandHandler) return;
			};
		} else {
			const commandHandler = await this.handleCommand(client, message, command, message.channel.type == "dm" ? client.globalPrefix : prefix);
			if (!commandHandler) return;
		};
		let argsValues: Array<any> = [];
		if (command.args) {
			for (const arg of command.args) {
				let argument: any = arg.default ? await arg.default(message) : null;
				const { type: argType } = arg;
				const argIndex = command.args.indexOf(arg);
				if (!args[argIndex] && arg.required) return client.createArgumentError(message, {
					title: arg.errorTitle ? arg.errorTitle : "Syntax Error",
					description: arg.errorMessage ? arg.errorMessage : `You need to provide the \`${argIndex + 1}.\` argument!`
				}, command.usage);
				if (argType == "messageChannel") argument = message.mentions.channels.first() && message.guild.channels.cache.has(message.mentions.channels.first().id) ? message.mentions.channels.first() : (message.guild.channels.cache.filter(channel => channel.type == "news" || channel.type == "text").has(args[argIndex]) ? message.guild.channels.cache.get(args[argIndex]) as TextChannel | NewsChannel : null);
				else if (argType == "member") argument = message.mentions.members.first()?.id != message.author.id ? message.mentions.members.first() : (message.guild.members.cache.filter(member => member.id != message.author.id).has(args[argIndex]) ? message.guild.members.cache.get(arg[argIndex]) : null);
				else if (argType == "realMember") argument = message.mentions.members.first() && message.guild.members.cache.filter(member => !member.user.bot && member.id != message.author.id).has(message.mentions.members.first().id) ? message.mentions.members.first() : (message.guild.members.cache.filter(member => !member.user.bot && member.id != message.author.id).has(args[argIndex]) ? message.guild.members.cache.get(args[argIndex]) : null);
				else if (argType == "user") argument = message.mentions.users.first()?.id != message.author.id ? message.mentions.users.first() : (client.users.cache.filter(user => user.id != message.author.id).has(args[argIndex]) ? client.users.cache.get(args[argIndex]) : null);
				else if (argType == "realUser") argument = message.mentions.users.first() && client.users.cache.filter(user => !user.bot && user.id != message.author.id).has(message.mentions.users.first().id) ? message.mentions.users.first() : (client.users.cache.filter(user => !user.bot && user.id != message.author.id).has(args[argIndex]) ? client.users.cache.get(args[argIndex]) : null);
				else if (argType == "string") argument = typeof args[argIndex] == "string" ? args[argIndex] : null;
				else if (argType == "text") argument = typeof args.slice(argIndex).join(" ") == "string" ? args.slice(argIndex).join(" ") : null;
				else if (argType == "number") argument = !isNaN(args[argIndex] as unknown as number) ? parseInt(args[argIndex]) : null;
				else if (argType == "certainString") argument = arg.certainStrings.includes(args[argIndex].toLowerCase()) ? args[argIndex] : null;
				else if (argType == "guild") argument = client.guilds.cache.has(args[argIndex]) ? client.guilds.cache.get(args[argIndex]) : null;
				else if (argType == "custom") argument = arg.filter ? (arg.filter(message, args[argIndex]) ? args[argIndex] : null) : null;
				if (argument) argsValues[argIndex] = argument;
				if (arg.filter && arg.filter(message, args[argIndex]) && (!argument || !argsValues[argIndex])) argsValues[argIndex] = args[argIndex];
				if (arg.required && !argsValues[argIndex]) return client.createArgumentError(message, {
					title: arg.errorTitle ? arg.errorTitle : "Syntax Error",
					description: arg.errorMessage ? arg.errorMessage : `You need to provide the \`${argIndex + 1}.\` argument!`
				}, command.usage);
			};
		};
		//COMMAND RUNNER\\
		try {
			await command.run(client, message, command.args ? argsValues : args, message.channel.type == "dm" ? client.globalPrefix : (await client.cache.getGuild(message.guild.id)).prefix);
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
	/**
	 * Checks if a member has the required command permissions
	 * @param {TextChannel | NewsChannel} channel The channel to respond to 
	 * @param {GuildMember} member The member to check for permissions 
	 * @param {Array<PermissionString>} permissions The permissions 
	 * @param {Command} command The command used
	 * @param {string} prefix The prefix of the guild
	 */
	private permissionChecker(client: GalaxyAlpha, channel: TextChannel | NewsChannel, member: GuildMember, permissions: Array<PermissionString>, prefix: string, usage: string): boolean {
		let perms: number = 0;
		for (const permission of permissions) if (member.permissions.has(permission)) perms++;
		if (perms == 0) {
			channel.send(client.createRedEmbed(true, `${prefix}${usage}`)
				.setTitle("Permission Manager")
				.setDescription(`${member.id == client.user.id ? "I" : "You"} need one of the following permissions to use this command:\n\`${permissions.map(perm => client.util.permissionConverted(perm)).join("`, `")}\``));
			return false;
		};
		return true;
	};
	private async handleCommand(client: GalaxyAlpha, message: Message, command: Command | SubCommand, prefix: string, commandUsage?: string): Promise<boolean> {
		const usage = commandUsage ? `${commandUsage} ${command.usage}` : command.usage;
		//OWNER COMMANDS\\
		if (command.ownerOnly && message.author.id != client.ownerID) return false;
		//DEVELOPER COMMANDS\\
		else if ((command.developerOnly || ((command as Command).category ? (command as Command).category == "developer" : false)) && !client.developers.includes(message.author.id)) return false;
		//GUILD COMMANDS\\
		if (command.guildOnly && message.channel.type == 'dm') {
			client.createArgumentError(message, {
				title: "Channel Manager",
				description: `You can only use this command inside a server!`
			}, usage);
			return false;
		} else if (command.dmOnly && message.channel.type != 'dm') {
			client.createArgumentError(message, {
				title: "Channel Manager",
				description: `You can only use this command inside DM's!`
			}, usage);
			return false;
		};
		//NEWS CHANNEL COMMANDS\\
		if (command.newsChannelOnly && message.channel.type != "news") {
			client.createArgumentError(message, {
				title: "Channel Manager",
				description: `You can only use this command in announcement channels!`
			}, usage);
			return false;
		} else if (command.textChannelOnly && message.channel.type != "text") {
			client.createArgumentError(message, {
				title: "Channel Manager",
				description: `You can only use this command in text channels!`
			}, usage);
			return false;
		};
		//REQUIRED ROLES\\
		if (message.channel.type != "dm" && command.requiredRoles) {
			const guildSettings = await client.cache.getGuild(message.guild.id);
			const roles: Array<Role> = [];
			for (const requiredRole of command.requiredRoles) {
				const roleID = guildSettings[requiredRole];
				if (roleID) {
					const role = message.guild.roles.cache.get(roleID as string);
					if (role) roles.push(role);
				};
			};
			if (roles.length > 0) {
				let perms: number = 0;
				for (const role of roles) if (message.member.roles.cache.has(role.id)) perms++;
				if (perms == 0 && command.userPermissions ? this.howManyPermissions(message.member, command.userPermissions) : true) {
					client.createArgumentError(message, { title: "Role Manager", description: `You need one of the following roles to use this command:\n${roles.join(", ")}` }, usage);
					return false;
				};
			};
		};
		//USER PERMISSIONS\\
		if (message.channel.type != "dm" && command.userPermissions) {
			const permissions = this.permissionChecker(client, message.channel as TextChannel | NewsChannel, message.member, command.userPermissions, prefix, usage);
			if (!permissions) return false;
		}
		//CLIENT PERMISSIONS\\
		if (message.channel.type != "dm" && command.clientPermissions) {
			const permissions = this.permissionChecker(client, message.channel as TextChannel | NewsChannel, message.guild.me, command.clientPermissions, prefix, usage);
			if (!permissions) return false;
		};
		//COOLDOWN CHECKER\\
		if (!commandUsage && client.cooldowns.has(`${message.author.id}-${command.name}`)) {
			client.createArgumentError(message, { title: "🕐 Cooldown Manager", description: `You are on a cooldown!\nYou have to wait ${client.humanizer(client.cooldowns.get(`${message.author.id}-${command.name}`) - message.createdTimestamp, { units: ["mo", "w", "d", "h", "m", "s"], round: true })}` }, usage);
			return false;
		};
		return true;
	};
	private howManyPermissions(member: GuildMember, permissions: Array<PermissionString>): number {
		let perms: number = 0;
		for (const permission of permissions) if (member.permissions.has(permission)) perms++;
		return perms;
	};
};