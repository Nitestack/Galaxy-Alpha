//MODULES\\
import fs from 'fs';
import path from 'path';
import ms from 'ms';
import Discord, { StreamDispatcher, VoiceChannel } from 'discord.js';
import mongoose from 'mongoose';
import Levels from 'discord-xp';
import ytSearch from "yt-search";
//CLASSES\\
import Command from '@root/Command';
import Feature from '@root/Feature';
import Event from '@root/Event';
//MANAGER\\
import GiveawayManager from '@commands/Giveaway/Giveaway';
import TicketManager from '@commands/Utility/Ticket/Ticket';
import DropManager from '@commands/Giveaway/Drop';
import CacheManager from '@root/GlobalCache';
import MusicManager from "@commands/Music/Music";
//MODELS\\
import GiveawaySchema from '@models/Giveaways/giveaways';
import DropSchema from '@models/Giveaways/drops';
import TicketSchema from '@models/ticket';
import GuildSchema from '@models/guild';
import MessageSchema from '@models/messageCount';
import LevelSchema from '@models/levels';
//ANY THING ELSE\\
import { permissions, permissionsShowCase, monthNames, weekDays } from '@root/util';
import { endGiveaway } from '@commands/Giveaway/Giveaway';
import { deleteDrop } from '@commands/Giveaway/Drop';

interface GalaxyAlphaOptions {
	ownerID: string;
	globalPrefix: string;
	token: string;
	commandsDir: string;
	eventsDir: string;
	featuresDir: string;
	mongoDBUrl: string;
	developers?: Array<string>;
	contributors?: Array<string>;
	supportGuildID?: string;
	defaultEmbedColor?: string;
};

interface Queue {
	title: string;
	requesterID: string;
	author: ytSearch.Author;
	description: string;
	image: string;
	duration: ytSearch.Duration;
	views: number;
	url: string;
};

export default class GalaxyAlpha extends Discord.Client {
	public ownerID: string;
	public globalPrefix: string;
	public developers: Array<string>;
	public contributors: Array<string>;
	public supportGuildID: string;
	public defaultColor: string;
	public constructor(options: GalaxyAlphaOptions) {
		super({
			ws: { intents: Discord.Intents.ALL },
			partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
			disableMentions: "everyone"
		});
		if (!options.ownerID) throw new Error("A bot owner has to be provided!");
		if (!options.globalPrefix) throw new Error("A global prefix has to be provided!");
		if (!options.token) throw new Error("A token has to be provided!");
		if (!options.commandsDir) throw new Error("The command directory has to be provided!");
		if (!options.eventsDir) throw new Error("The event directory has to be provided!");
		if (!options.eventsDir) throw new Error("The feature directory has to be provided!");
		if (!options.mongoDBUrl) throw new Error("The MongoDB url has to be provided!");
		if (options.defaultEmbedColor) {
			this.defaultColor = options.defaultEmbedColor;
		} else {
			this.defaultColor = "#808080"
		};
		this.ownerID = options.ownerID;
		if (!options.developers) {
			this.developers = [options.ownerID]
		} else {
			this.developers = options.developers;
		};
		this.globalPrefix = options.globalPrefix;
		this.contributors = options.contributors;
		if (options.supportGuildID) this.supportGuildID = options.supportGuildID;
		//START\\
		this.login(options.token).catch((error: unknown) => console.log(error));
		console.log("------------------------------------------------------------------");
		this.readCommand(options.commandsDir);
		console.log("------------------------------------------------------------------");
		this.readEvent(options.eventsDir);
		console.log("------------------------------------------------------------------");
		this.readFeature(options.featuresDir);
		console.log("------------------------------------------------------------------");
		mongoose.connect(options.mongoDBUrl, {
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		}).then(() => console.log("|MongoDB:        |✅ Connected!")).catch(err => console.log(err));
		mongoose.set('useNewUrlParser', true);
		mongoose.set('useFindAndModify', false);
		mongoose.set('useUnifiedTopology', true);
		Levels.setURL(options.mongoDBUrl);
		this.once("ready", async () => {
			/*//GIVEAWAYS\\
			const giveaways = await GiveawaySchema.find({});
			giveaways.forEach(giveaway => {
				endGiveaway(giveaway.messageID);
			});
			//DROPS\\
			const drops = await DropSchema.find({});
			drops.forEach(drop => {
				deleteDrop(drop.messageID);
			});
			//TICKETS\\
			const tickets = await TicketSchema.find({});
			tickets.forEach(async ticket => {
				const check = this.channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').get(ticket.channelID);
				if (!check) await TicketSchema.findOneAndDelete({
					channelID: ticket.channelID
				});
			});
			//GUILDS\\
			const guilds = await GuildSchema.find({});
			guilds.forEach(async guild => {
				const check = this.guilds.cache.get(guild.guildID);
				if (!check) await GuildSchema.findOneAndDelete({
					guildID: guild.guildID
				});
			});
			//MESSAGES\\
			const messages = await MessageSchema.find({});
			messages.forEach(async message => {
				const guildCheck = this.guilds.cache.get(message.messageGuildID);
				if (guildCheck) {
					const memberCheck = guildCheck.members.cache.get(message.messageUserID);
					if (!memberCheck) await MessageSchema.findOneAndDelete({
						messageGuildID: message.messageUserID,
						messageUserID: message.messageUserID
					});
				} else {
					await GuildSchema.findOneAndDelete({
						guildID: message.messageGuildID
					});
				};
			});
			const levels = await LevelSchema.find({});
			levels.forEach(async level => {
				const guildCheck = this.guilds.cache.get(level.guildID);
				if (guildCheck) {
					const memberCheck = guildCheck.members.cache.get(level.userID);
					if (!memberCheck) await MessageSchema.findOneAndDelete({
						guildID: level.guildID,
						userID: level.userID
					});
				} else {
					await GuildSchema.findOneAndDelete({
						guildID: level.guildID
					});
				};
			});*/
			if (options.supportGuildID) this.supportGuild = this.guilds.cache.get(this.supportGuildID);
			this.features.forEach(feature => feature.run(this));
			console.log("------------------------------------------------------------------");
			console.log('|Created At:     |', `${weekDays[this.user.createdAt.getUTCDay()]}, ${monthNames[this.user.createdAt.getUTCMonth()]} ${this.user.createdAt.getUTCDate()}, ${this.user.createdAt.getUTCFullYear()}, ${this.user.createdAt.getUTCHours()}:${this.user.createdAt.getUTCMinutes()}:${this.user.createdAt.getUTCSeconds()}:${this.user.createdAt.getUTCMilliseconds()} UTC`);
			console.log('|Presence Status:|', this.user.presence.status);
			console.log('|Uptime:         |', this.ms(this.uptime));
			console.log('|WS Status:      |', this.ws.status);
			console.log('|API Ping:       |', this.ms(this.ws.ping));
			console.log('|API Gateway:    |', this.ws.gateway);
			console.log('|Servers:        |', this.guilds.cache.size);
			console.log('|Members:        |', this.users.cache.size);
			console.log('|Channels:       |', this.channels.cache.size);
			console.log('|Client Status:  |', '✅ Online!');
			console.log('|Author:         |', 'HydraNhani#8303');
			console.log("------------------------------------------------------------------");
			const activityArray: Array<string> = [
				`${this.globalPrefix}help | Support Server: discord.gg/qvbFn6bXQX`,
				`${this.guilds.cache.size.toLocaleString()} servers | Support Server: discord.gg/qvbFn6bXQX`,
				`${this.users.cache.size.toLocaleString()} users | Support Server: discord.gg/qvbFn6bXQX`,
				`${this.channels.cache.size.toLocaleString()} channels | Support Server: discord.gg/qvbFn6bXQX`,
				`${this.users.cache.get(this.ownerID).tag} | Support Server: discord.gg/qvbFn6bXQX`
			];
			const typeArray: Array<number | "PLAYING" | "WATCHING" | "LISTENING" | "STREAMING" | "CUSTOM_STATUS" | "COMPETING"> = [
				"PLAYING",
				"WATCHING",
				"LISTENING"
			];
			let index: number = 0;
			let typeIndex: number = 0;
			setInterval(() => {
				if (activityArray.length == index) index = 0;
				if (typeArray.length == typeIndex) typeIndex = 0;
				this.user.setPresence({
					activity: {
						name: `${activityArray[index]}`,
						type: typeArray[typeIndex]
					},
					status: "online"
				});
				index++;
				typeIndex++;
			}, 10000);
		});
	};
	//MODULES\\
	public ms = ms;
	public discordJS = Discord;
	public mongoose = mongoose;
	//INFOS\\
	public dataSchemaObjectId: string = "5ffb5b87ef40ba40a0842eb5";
	public inviteLink: string = "https://discord.com/api/oauth2/authorize?client_id=761590139147124810&permissions=976612438&scope=bot";
	public supportGuild: Discord.Guild;
	//COLLECTIONS\\
	public commands: Discord.Collection<string, Command> = new Discord.Collection();
	public aliases: Discord.Collection<string, string> = new Discord.Collection();
	public cooldowns: Discord.Collection<string, number> = new Discord.Collection();
	public features: Discord.Collection<string, Feature> = new Discord.Collection();
	public snipes: Discord.Collection<string, Discord.Message> = new Discord.Collection();
	public ghostPings: Discord.Collection<string, Discord.Message> = new Discord.Collection();
	public queue: Discord.Collection<string, {
		guildID: string,
		queue: Array<Queue>,
		nowPlaying: boolean,
		dispatcher: StreamDispatcher,
		voiceChannel: VoiceChannel,
		beginningToPlay: Date,
		stopToPlay: Date,
		singleLoop: boolean,
		multipleLoop: boolean,
		shuffle: boolean
	}> = new Discord.Collection();
	//EMOJIS\\
	public warningInfoEmoji: string = "<a:warning_info:786706519071916032>";
	public developerToolsEmoji: string = "<:tools_dev:786332338207457340>";
	public infoEmoji: string = "<:info:786676407362781195>";
	public chatEmoji: string = "<a:chat:786707292870803506>";
	public memberEmoji: string = "<:members:786705341484236800>";
	public workingGearEmoji: string = "<a:working_gear:786707189468495882>";
	public yesEmoji: string = "<a:yes:786708571664154644>";
	public noEmoji: string = "<a:no:786708723976503326>";
	public arrowEmoji: string = "<a:arrow:786706422317580318>";
	public profileEmoji: string = "<:galaxy_alpha:792083061666873345>";
	public desktopEmoji: string = "<:desktop_dev:786332949226323988>";
	public galaxyAlphaEmoji: string = "<:galaxy_alpha:792083061666873345>";
	public protectedEmoji: string = "<a:protected:786707379470598174>";
	//EMOJI ID'S\\
	public warningInfoEmojiID: string = this.getEmojiID(this.warningInfoEmoji);
	public developerToolsEmojiID: string = this.getEmojiID(this.developerToolsEmoji);
	public infoEmojiID: string = this.getEmojiID(this.infoEmoji);
	public chatEmojiID: string = this.getEmojiID(this.chatEmoji);
	public memberEmojiID: string = this.getEmojiID(this.memberEmoji);
	public workingGearEmojiID: string = this.getEmojiID(this.workingGearEmoji);
	public yesEmojiID: string = this.getEmojiID(this.yesEmoji);
	public noEmojiID: string = this.getEmojiID(this.noEmoji);
	public arrowEmojiID: string = this.getEmojiID(this.arrowEmoji);
	public profileEmojiID: string = this.getEmojiID(this.profileEmoji);
	public desktopEmojiID: string = this.getEmojiID(this.desktopEmoji);
	public galaxyAlphaEmojiID: string = this.getEmojiID(this.galaxyAlphaEmoji);
	public protectedEmojiID: string = this.getEmojiID(this.protectedEmoji);
	//MANAGERS\\
	public giveaways: GiveawayManager = new GiveawayManager(this);
	public tickets: TicketManager = new TicketManager(this);
	public drop: DropManager = new DropManager(this);
	public cache: CacheManager = new CacheManager(this);
	public music: MusicManager = new MusicManager(this);
	//PERMISSIONS\\
	public permissions: Array<string> = permissions;
	public permissionsShowCase: Array<string> = permissionsShowCase;
	//VOTE LINKS\\
	public topGGBot: string = "https://top.gg/bot/761590139147124810/vote";
	public topGGServer: string = "https://top.gg/servers/783440776285651024/vote";
	public discordBotList: string = "https://discordbotlist.com/bots/galaxy-alpha/upvote";
	public discordServerList: string = "https://discordbotlist.com/servers/galaxy-alpha/upvote";
	//START\\
	private async readCommand(commandPath: string) {
		const files = fs.readdirSync(path.join(__dirname, commandPath))
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, commandPath, file));
			if (stat.isDirectory()) {
				this.readCommand(path.join(commandPath, file));
			} else if (file != "Giveaway.ts" && file != "Ticket.ts" && file != "Drop.ts" && file != "Music.ts") {
				if (!file.endsWith(".ts")) {
					console.log(`|Command:        |❌ NO TypeScript file - ${file}`);
					continue;
				};
				const CommandModule = require(path.join(__dirname, commandPath, file));
				const command: Command = new CommandModule(this);
				if (this.commands.some(cmd => cmd.name == command.name || cmd.aliases ? cmd.aliases.includes(command.name) : false)) continue;
				for (const alias of command.aliases ? command.aliases : []) {
					if (this.commands.some(cmd => cmd.name == alias || cmd.aliases ? cmd.aliases.includes(alias) : false)) continue;
				};
				this.commands.set(command.name, command);
				if (command.aliases) {
					command.aliases.map(alias => this.aliases.set(alias, command.name));
				};
				console.log(`|Command:        |✅ ${command.name}`);
			};
		};
	};
	private async readEvent(eventPath: string) {
		const files = fs.readdirSync(path.join(__dirname, eventPath));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, eventPath, file));
			if (stat.isDirectory()) {
				this.readEvent(path.join(eventPath, file));
			} else {
				if (!file.endsWith(".ts")) {
					console.log(`|Event:          |❌ NO TypeScript file ${file}`);
					continue;
				};
				const EventModule = require(path.join(__dirname, eventPath, file));
				const event: Event = new EventModule(this);
				this.on(event.name, event.run.bind(null, this));
				console.log(`|Event:          |✅ ${event.name}`);
			};
		};
	};
	private async readFeature(featurePath: string) {
		const files = fs.readdirSync(path.join(__dirname, featurePath));
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, featurePath, file));
			if (stat.isDirectory()) {
				this.readFeature(path.join(featurePath, file));
			} else {
				if (!file.endsWith(".ts")) {
					console.log(`|Feature:        |❌ NO TypeScript file ${file}`);
					continue;
				};
				const FeatureModule = require(path.join(__dirname, featurePath, file));
				const feature: Feature = new FeatureModule(this);
				this.features.set(feature.name, feature);
				console.log(`|Feature:        |✅ ${feature.name}`);
			};
		}
	};
	public createEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: this.defaultColor,
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``,
						inline: true,
					},
				],
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: this.defaultColor,
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL(),
				},
			}).setTimestamp();
		};
	};
	public createGreenEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: '#2ECC71',
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``,
						inline: true,
					},
				],
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: '#2ECC71',
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL(),
				},
			}).setTimestamp();
		};
	};
	public createYellowEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: '#F1C40F',
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``,
						inline: true,
					},
				],
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: '#F1C40F',
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL(),
				},
			}).setTimestamp();
		};
	};
	public createRedEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: '#ff0000',
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``,
						inline: true
					}
				]
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: '#ff0000',
				footer: {
					text: "Support Server: https://discord.gg/qvbFn6bXQX",
					iconURL: this.user.displayAvatarURL()
				}
			}).setTimestamp();
		};
	};
	//GET EMOJI ID\\
	private getEmojiID(emoji: string): string {
		return emoji.split(":")[2].split(">")[0];
	};
};