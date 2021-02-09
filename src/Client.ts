//MODULES\\
import fs from 'fs';
import path from 'path';
import ms from 'ms';
import Discord from 'discord.js';
import mongoose from 'mongoose';
import ytSearch from "yt-search";
import duration from "humanize-duration";
//CLASSES\\
import Command, { Categories } from '@root/Command';
import Feature from '@root/Feature';
import Event from '@root/Event';
//MANAGER\\
import GiveawayManager from '@commands/Giveaway/Giveaway';
import TicketManager from '@commands/Utility/Ticket/Ticket';
import DropManager from '@commands/Giveaway/Drop';
import CacheManager from '@root/GlobalCache';
import MusicManager from "@commands/Music/Music";
import GalaxyAlphaUtil from "@root/Util";
//MODELS\\
import GiveawaySchema from '@models/Giveaways/giveaways';
import DropSchema from '@models/Giveaways/drops';
import TicketSchema from '@models/ticket';
import GuildSchema from '@models/guild';
import LevelSchema from '@root/Models/level';
//ANY THING ELSE\\
import { endGiveaway } from '@commands/Giveaway/Giveaway';
import { deleteDrop } from '@commands/Giveaway/Drop';
import { Readable } from 'stream';

interface GalaxyAlphaOptions {
	ownerID: string;
	globalPrefix: string;
	token: string;
	commandsDir: string;
	eventsDir: string;
	featuresDir: string;
	mongoDBUrl: string;
	developers?: Array<string>;
	ignoreFiles?: Array<string>;
	contributors?: Array<string>;
	supportGuildID?: string;
	defaultEmbedColor?: string;
	xpPerMessage?: number;
};

export interface Queue {
	title: string;
	requesterID: string;
	author: ytSearch.Author;
	image: string;
	duration: ytSearch.Duration;
	views: number;
	url: string;
	videoID: string;
	genre: string;
	ago: string;
	uploadDate: string;
};

export default class GalaxyAlpha extends Discord.Client {
	public ownerID: string;
	public globalPrefix: string;
	public developers: Array<string>;
	public contributors: Array<string>;
	public supportGuildID: string;
	public defaultColor: string;
	public ignoreFiles: Array<string>;
	public xpPerMessage: number;
	/**
	 * @param {GalaxyAlphaOptions} options The options of Galaxy Alpha
	 */
	constructor(options: GalaxyAlphaOptions) {
		super({
			ws: { intents: Discord.Intents.ALL },
			partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
			disableMentions: "everyone",
			shards: "auto",
			shardCount: 1
		});
		if (!options.ownerID) throw new Error("A bot owner has to be provided!");
		if (!options.globalPrefix) throw new Error("A global prefix has to be provided!");
		if (!options.token) throw new Error("A token has to be provided!");
		if (!options.commandsDir) throw new Error("The command directory has to be provided!");
		if (!options.eventsDir) throw new Error("The event directory has to be provided!");
		if (!options.eventsDir) throw new Error("The feature directory has to be provided!");
		if (!options.mongoDBUrl) throw new Error("The MongoDB url has to be provided!");
		if (options.defaultEmbedColor) this.defaultColor = options.defaultEmbedColor;
		else this.defaultColor = "#808080";
		if (!options.developers) this.developers = [options.ownerID];
		else this.developers = options.developers;
		if (options.ignoreFiles) this.ignoreFiles = options.ignoreFiles;
		else this.ignoreFiles = [];
		if (options.xpPerMessage) this.xpPerMessage = options.xpPerMessage;
		else this.xpPerMessage = Math.floor(this.util.getRandomArbitrary(1, 20));
		this.globalPrefix = options.globalPrefix;
		this.contributors = options.contributors;
		this.ownerID = options.ownerID;
		if (options.supportGuildID) this.supportGuildID = options.supportGuildID;
		//LOGIN\\
		this.login(options.token).catch((error: any) => console.log(error));
		//READ COMMANDS, EVENTS, FEATURES\\
		this.readCommand(options.commandsDir);
		this.readEvent(options.eventsDir);
		this.readFeature(options.featuresDir);
		//MONGO DB\\
		mongoose.connect(options.mongoDBUrl, {
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		}).then(() => console.log("|MongoDB:        |✅ Connected!")).catch(err => console.log(err));
		mongoose.set('useNewUrlParser', true);
		mongoose.set('useFindAndModify', false);
		mongoose.set('useUnifiedTopology', true);
		//READY EVENT\\
		this.once("ready", async () => {
			if (options.supportGuildID) this.supportGuild = this.guilds.cache.get(this.supportGuildID);
			this.features.forEach(feature => feature.run(this));
			this.DBfilter(false);
			console.log("------------------------------------------------------------------");
			console.log('|Created At:     |', `${this.util.weekDays[this.user.createdAt.getUTCDay()]}, ${this.util.monthNames[this.user.createdAt.getUTCMonth()]} ${this.user.createdAt.getUTCDate()}, ${this.user.createdAt.getUTCFullYear()}, ${this.user.createdAt.getUTCHours()}:${this.user.createdAt.getUTCMinutes()}:${this.user.createdAt.getUTCSeconds()}:${this.user.createdAt.getUTCMilliseconds()} UTC`);
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
						name: activityArray[index],
						type: typeArray[typeIndex]
					},
					status: "online"
				});
				index++;
				typeIndex++;
			}, 10000);
			setInterval(() => this.cache.clearCacheAndSave(), 3600000);
		});
	};
	//MODULES\\
	public ms = ms;
	public discordJS = Discord;
	public mongoose = mongoose;
	//INFOS\\
	public dataSchemaObjectId: string = "5ffb5b87ef40ba40a0842eb5";
	public inviteLink: string = "https://discord.com/api/oauth2/authorize?client_id=761590139147124810&permissions=8&scope=bot";
	public supportGuild: Discord.Guild;
	//COLLECTIONS\\
	public commands: Discord.Collection<string, Command> = new Discord.Collection();
	public aliases: Discord.Collection<string, string> = new Discord.Collection();
	public cooldowns: Discord.Collection<string, number> = new Discord.Collection();
	public features: Discord.Collection<string, Feature> = new Discord.Collection();
	public inGame: Discord.Collection<string, {
		userID: string,
		guildID: string,
		game: "Tic Tac Toe" | "Chess" | "Hangman" | "Connect 4"
	}> = new Discord.Collection();
	public snipes: Discord.Collection<string, Discord.Message> = new Discord.Collection();
	public modMails: Discord.Collection<string, Discord.Guild> = new Discord.Collection();
	public categories: Discord.Collection<Categories, Array<Command>> = new Discord.Collection();
	public ghostPings: Discord.Collection<string, Discord.Message> = new Discord.Collection();
	public recorder: Discord.Collection<string, Readable> = new Discord.Collection();
	public queue: Discord.Collection<string, {
		guildID: string,
		queue: Array<Queue>,
		nowPlaying: boolean,
		dispatcher: Discord.StreamDispatcher,
		voiceChannel: Discord.VoiceChannel,
		beginningToPlay: Date,
		stopToPlay: Date,
		singleLoop: boolean,
		multipleLoop: boolean,
		shuffle: boolean,
		panel?: Discord.Message;
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
	public music: MusicManager = new MusicManager(this);
	public cache: CacheManager = new CacheManager(this);
	public util: GalaxyAlphaUtil = new GalaxyAlphaUtil();
	//PERMISSIONS\\
	public permissions: Array<string> = this.util.permissions;
	public permissionsShowCase: Array<string> = this.util.permissionsShowCase;
	//VOTE LINKS\\
	public topGGBot: string = "https://top.gg/bot/761590139147124810/vote";
	public topGGServer: string = "https://top.gg/servers/783440776285651024/vote";
	public discordBotList: string = "https://discordbotlist.com/bots/galaxy-alpha/upvote";
	public discordServerList: string = "https://discordbotlist.com/servers/galaxy-alpha/upvote";
	//PRIVATE METHODS\\
	private async readCommand(commandPath: string) {
		const files = fs.readdirSync(path.join(__dirname, commandPath))
		for (const file of files) {
			const stat = fs.lstatSync(path.join(__dirname, commandPath, file));
			if (stat.isDirectory()) {
				this.readCommand(path.join(commandPath, file));
			} else if (!this.ignoreFiles.includes(file)) {
				if (!file.endsWith(".ts")) {
					console.log(`|Command:        |❌ NO TypeScript file - ${file}`);
					continue;
				};
				const { default: Command } = await import(path.join(__dirname, commandPath, file));
				const command: Command = new Command();
				if (this.commands.some(cmd => cmd.name == command.name || cmd.aliases ? cmd.aliases.includes(command.name) : false)) continue;
				for (const alias of command.aliases ? command.aliases : []) {
					if (this.commands.some(cmd => cmd.name == alias || cmd.aliases ? cmd.aliases.includes(alias) : false)) continue;
				};
				this.commands.set(command.name, command);
				const commandsArray: Array<Command> = this.categories.get(command.category) || [];
				commandsArray.push(command);
				this.categories.set(command.category, commandsArray);
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
			} else if (!this.ignoreFiles.includes(file)) {
				if (!file.endsWith(".ts")) {
					console.log(`|Event:          |❌ NO TypeScript file ${file}`);
					continue;
				};
				const { default: Event } = await import(path.join(__dirname, eventPath, file));
				const event: Event = new Event();
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
			} else if (!this.ignoreFiles.includes(file)) {
				if (!file.endsWith(".ts")) {
					console.log(`|Feature:        |❌ NO TypeScript file ${file}`);
					continue;
				};
				const { default: Feature } = await import(path.join(__dirname, featurePath, file));
				const feature: Feature = new Feature();
				this.features.set(feature.name, feature);
				console.log(`|Feature:        |✅ ${feature.name}`);
			};
		}
	};
	//PUBLIC METHODS\\
	public humanizer(ms: number, options?: duration.Options): string {
		return duration(ms, options);
	};
	public createEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: this.defaultColor,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``
					}
				],
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: this.defaultColor,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL(),
				}
			}).setTimestamp();
		};
	};
	public createGreenEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: '#2ECC71',
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``
					}
				],
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: '#2ECC71',
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL(),
				}
			}).setTimestamp();
		};
	};
	public createYellowEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: '#F1C40F',
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``
					}
				],
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: '#F1C40F',
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL(),
				}
			}).setTimestamp();
		};
	};
	public createRedEmbed(usageField?: Boolean, usage?: Discord.StringResolvable): Discord.MessageEmbed {
		if (usageField) {
			return new Discord.MessageEmbed({
				color: '#ff0000',
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '🤔 Usage:',
						value: `${this.arrowEmoji} \`${usage}\``
					}
				]
			}).setTimestamp();
		} else {
			return new Discord.MessageEmbed({
				color: '#ff0000',
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL()
				}
			}).setTimestamp();
		};
	};
	//GET EMOJI ID\\
	private getEmojiID(emoji: string): string {
		return emoji.split(":")[2].split(">")[0];
	};
	//AUTO FILTER DATABASE\\
	private async DBfilter(enable: boolean) {
		if (!enable) return;
		//GIVEAWAYS\\
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
		//MESSAGES AND LEVEL\\
		const levels = await LevelSchema.find({});
		levels.forEach(async level => {
			const guildCheck = this.guilds.cache.get(level.guildID);
			if (guildCheck) {
				const memberCheck = guildCheck.members.cache.get(level.userID);
				if (!memberCheck) await LevelSchema.findOneAndDelete({
					guildID: level.guildID,
					userID: level.userID
				});
			} else {
				await GuildSchema.findOneAndDelete({
					guildID: level.guildID
				});
			};
		});
	};
};