//MODULES\\
import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import ms from 'ms';
import { Client, Intents, Collection, Message, Guild, MessageEmbed, NewsChannel, TextChannel, WebhookClient, StringResolvable, ShardingManager } from 'discord.js';
import { set, connect, ConnectionOptions, connection, Connection } from 'mongoose';
import Humanizer from "humanize-duration";
import ascii from "ascii-table";
//CLASSES\\
import Command, { Categories } from '@root/Command';
import Feature from '@root/Feature';
import Event from '@root/Event';
import SlashCommand from '@root/SlashCommand';
import Queue from '@commands/Music/Queue';
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
import LevelSchema from '@models/level';
//ANY THING ELSE\\
import { deleteDrop } from '@commands/Giveaway/Drop';
//TABLES\\
const clientInfoTable = new ascii("Client Info");

interface GalaxyAlphaOptions {
	ownerID: string;
	globalPrefix: string;
	token: string;
	commandsDir: string;
	eventsDir: string;
	featuresDir: string;
	slashCommandsDir: string;
	mongoDBUrl: string;
	mongoDBConnectionOptions?: ConnectionOptions;
	developers?: Array<string>;
	ignoreFiles?: Array<string>;
	contributors?: Array<string>;
	supportGuildID?: string;
	defaultEmbedColor?: string;
	xpPerMessage?: number;
};

export default class GalaxyAlpha extends Client {
	/**
	 * @param {GalaxyAlphaOptions} options The options of Galaxy Alpha
	 */
	constructor(public config: GalaxyAlphaOptions) {
		super({
			ws: {
				intents: Intents.ALL
			},
			partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
			disableMentions: "everyone",
			shards: "auto",
			shardCount: 1,
			retryLimit: 0,
			restRequestTimeout: 60000
		});
		if (!this.config.ownerID) throw new Error("A bot owner has to be provided!");
		if (!this.config.globalPrefix) throw new Error("A global prefix has to be provided!");
		if (!this.config.token) throw new Error("A token has to be provided!");
		if (!this.config.commandsDir) throw new Error("The command directory has to be provided!");
		if (!this.config.eventsDir) throw new Error("The event directory has to be provided!");
		if (!this.config.eventsDir) throw new Error("The feature directory has to be provided!");
		if (!this.config.mongoDBUrl) throw new Error("The MongoDB url has to be provided!");
		this.start(true);
		//READY EVENT\\
		this.once("ready", async () => {
			this.inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&scope=applications.commands%20bot`;
			//GUILD\\
			if (this.config.supportGuildID) this.supportGuild = this.guilds.cache.get(this.supportGuildID);
			//SLASH COMMANDS\\
			const commands: Array<any> = await this.getApp("783440776285651024").commands.get();
			this.slashCommands.forEach(async slashCommand => {
				const command = commands.find(command => command.name.toLowerCase() == slashCommand.name.toLowerCase());
				if (command) await SlashCommand.editSlashCommand(command.id, slashCommand, "783440776285651024");
				else await SlashCommand.createSlashCommand(slashCommand, "783440776285651024");
			});
			//CLIENT INFO\\
			clientInfoTable.addRow('Created At', this.util.dateFormatter(this.user.createdAt));
			clientInfoTable.addRow('Presence Status', this.user.presence.status);
			clientInfoTable.addRow('Uptime', this.ms(this.uptime));
			clientInfoTable.addRow('WS Status', this.ws.status);
			clientInfoTable.addRow('API Ping', this.ms(this.ws.ping));
			clientInfoTable.addRow('API Gateway', this.ws.gateway);
			clientInfoTable.addRow('Servers', this.guilds.cache.size);
			clientInfoTable.addRow('Members', this.users.cache.size);
			clientInfoTable.addRow('Channels', this.channels.cache.size);
			clientInfoTable.addRow('Client Status', '✅ Online!');
			clientInfoTable.addRow('Author', 'HydraNhani#8303');
			//TABLES\\
			console.log(clientInfoTable.toString());
			//FEATURE HANDLER\\
			this.features.forEach(feature => feature.run(this));
			//DATABASE FILTER\\
			this.DBfilter(this.user.id == "761590139147124810" ? true : false);
			this.secret = this.user.id == "761590139147124810" ? process.env.CLIENT_SECRET : process.env.CLIENT_BETA_SECRET;
			await import("@web/server");
			//ACTIVITY\\
			const activityArray: Array<string> = [
				`${this.globalPrefix}help | Support Server: gg/qvbFn6bXQX`,
				`${this.guilds.cache.size.toLocaleString()} servers | Support Server: gg/qvbFn6bXQX`,
				`${this.users.cache.size.toLocaleString()} users | Support Server: gg/qvbFn6bXQX`,
				`${this.channels.cache.size.toLocaleString()} channels | Support Server: gg/qvbFn6bXQX`,
				`${this.users.cache.get(this.ownerID).tag} | Support Server: gg/qvbFn6bXQX`
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
			setInterval(async () => await this.cache.clearCacheAndSave(), 3600000);
		});
	};
	//MANAGERS\\
	public giveaways: GiveawayManager = new GiveawayManager(this);
	public tickets: TicketManager = new TicketManager(this);
	public drop: DropManager = new DropManager(this);
	public music: MusicManager = new MusicManager(this);
	public cache: CacheManager = new CacheManager(this);
	public util: GalaxyAlphaUtil = new GalaxyAlphaUtil(this);
	//CONFIGURATION\\
	public secret: string = "";
	public ownerID: string = this.config.ownerID;
	public globalPrefix: string = this.config.globalPrefix;
	public developers: Array<string> = this.config.developers || [this.ownerID];
	public contributors: Array<string> = this.config.contributors || [];
	public supportGuildID: string = this.config.supportGuildID || null;
	public defaultColor: string = this.config.defaultEmbedColor || this.util.embedColorHex;
	public ignoreFiles: Array<string> = this.config.ignoreFiles || [];
	public xpPerMessage: number = this.config.xpPerMessage || 20;
	//MODULES\\
	public ms = ms;
	public humanizer = Humanizer;
	//INFOS\\
	public dataSchemaObjectId: string = "5ffb5b87ef40ba40a0842eb5";
	public inviteLink: string = "";
	public supportGuild: Guild;
	//COLLECTIONS\\
	public commands: Collection<string, Command> = new Collection();
	public disabledCommands: Collection<string, Command> = new Collection();
	public slashCommands: Collection<string, SlashCommand> = new Collection();
	public events: Collection<string, Event> = new Collection();
	public aliases: Collection<string, string> = new Collection();
	public cooldowns: Collection<string, number> = new Collection();
	public features: Collection<string, Feature> = new Collection();
	public snipes: Collection<string, Message> = new Collection();
	public modMails: Collection<string, Guild> = new Collection();
	public categories: Collection<Categories, Array<Command>> = new Collection();
	public ghostPings: Collection<string, Message> = new Collection();
	public queue: Collection<string, Queue> = new Collection();
	public afks: Collection<string, {
		userID: string,
		afkSince: Date,
		reason: string
	}> = new Collection();
	public inGame: Collection<string, {
		userID: string,
		guildID: string,
		game: "Tic Tac Toe" | "Chess" | "Hangman" | "Connect 4"
	}> = new Collection();
	//VOTE LINKS\\
	public topGGBot: string = "https://top.gg/bot/761590139147124810/vote";
	public topGGServer: string = "https://top.gg/servers/783440776285651024/vote";
	public discordBotList: string = "https://discordbotlist.com/bots/galaxy-alpha/upvote";
	public discordServerList: string = "https://discordbotlist.com/servers/galaxy-alpha/upvote";
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
	public mongoDBConnection: Connection;
	//METHODS\\
	public async start(firstStart?: boolean) {
		if (firstStart) {
			//LOGIN\\
			this.login(this.config.token);
			process.on('unhandledRejection', (reason, promise) => {
				console.log('Unhandled Rejection at:', promise, 'reason:', reason);
			});
			//MONGO DB\\
			await this.connectToMongoDB(this.config.mongoDBUrl, {
				...this.config.mongoDBConnectionOptions,
				dbName: "data"
			});
			this.mongoDBConnection = connection;
			this.mongoDBConnection.on("open", () => {
				console.log("[Global Cache => MongoDB Connection Manager] Connected to MongoDB database");
			});
			this.mongoDBConnection.on("close", () => {
				console.log("[Global Cache => MongoDB Connection Manager] Closed MongoDB connection");
			});
		};
		//READ COMMANDS, EVENTS, FEATURES, SLASH COMMANDS\\
		this.commands.sweep(() => true);
		this.aliases.sweep(() => true);
		this.events.sweep(() => true);
		this.slashCommands.sweep(() => true);
		this.features.sweep(() => true);
		const commands = await this.readCommands(this.config.commandsDir);
		const events = await this.readEvents(this.config.eventsDir);
		const features = await this.readFeatures(this.config.featuresDir);
		const slashCommands = await this.readSlashCommands(this.config.slashCommandsDir);
		if (firstStart) {
			clientInfoTable.addRow("Commands", commands);
			clientInfoTable.addRow("Events", events);
			clientInfoTable.addRow("Features", features);
			clientInfoTable.addRow("Slash Commands", slashCommands);
		};
	};
	/**
	 * Reads all commands of the provided directory
	 * @param {string} commandPath The command directory
	 */
	public async readCommands(commandPath: string) {
		let i = 0;
		for (const file of readdirSync(join(__dirname, commandPath))) {
			if (lstatSync(join(__dirname, commandPath, file)).isDirectory()) this.readCommands(join(commandPath, file));
			else if (!this.ignoreFiles.includes(file)) {
				if (!file.endsWith(".ts")) {
					clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
					continue;
				};
				const { default: Command } = await import(join(__dirname, commandPath, file));
				if (typeof Command == "undefined") clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", `NO constructor - ${join(__dirname, commandPath, file)}`);
				const command: Command = new Command();
				if (!command.name) {
					clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "Name left!");
					continue;
				} else if (!command.description) {
					clientInfoTable.addRow(`${command.name}`, "❌", "Description left!");
					continue;
				} else if (!command.category) {
					clientInfoTable.addRow(`${command.name}`, "❌", "Category left!");
					continue;
				} else {
					if (this.commands.some(cmd => cmd.name == command.name || cmd.aliases?.includes(command.name))) {
						clientInfoTable.addRow(`${command.name}`, "❌", "Name already existing!");
						continue;
					};
					for (const alias of command.aliases ? command.aliases : []) if (this.commands.some(cmd => cmd.name == alias || cmd.aliases?.includes(alias))) {
						clientInfoTable.addRow(`${command.name}`, "❌", "Alias already existing!");
						continue;
					};
					this.commands.set(command.name.toLowerCase(), command);
					i++;
					if (!this.categories.has(command.category)) this.categories.set(command.category, []);
					this.categories.get(command.category).push(command);
					if (command.aliases) command.aliases.map(alias => this.aliases.set(alias.toLowerCase(), command.name));
				};
			};
		};
		return i;
	};
	/**
	 * Reads all events of the provided directory
	 * @param {string} eventPath The event directory
	 */
	public async readEvents(eventPath: string) {
		let i = 0;
		for (const file of readdirSync(join(__dirname, eventPath))) {
			if (lstatSync(join(__dirname, eventPath, file)).isDirectory()) this.readEvents(join(eventPath, file));
			else if (!this.ignoreFiles.includes(file)) {
				if (!file.endsWith(".ts")) {
					clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
					continue;
				};
				const { default: Event } = await import(join(__dirname, eventPath, file));
				const event: Event = new Event();
				if (!event.name) {
					clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "Name left!");
					continue;
				} else {
					this.on(event.name, event.run.bind(null, this));
					this.events.set(event.name, event);
					i++;
				};
			};
		};
		return i;
	};
	/**
	 * Reads all features of the provided directory
	 * @param {string} featurePath The feature directory 
	 */
	public async readFeatures(featurePath: string) {
		let i = 0;
		for (const file of readdirSync(join(__dirname, featurePath))) {
			if (lstatSync(join(__dirname, featurePath, file)).isDirectory()) this.readFeatures(join(featurePath, file));
			else if (!this.ignoreFiles.includes(file)) {
				if (!file.endsWith(".ts")) {
					clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
					continue;
				};
				const { default: Feature } = await import(join(__dirname, featurePath, file));
				const feature: Feature = new Feature();
				if (!feature.name) {
					clientInfoTable.addRow(`${feature.name}`, "❌", "Name left!");
					continue;
				} else {
					this.features.set(feature.name, feature);
					i++;
				};
			};
		};
		return i;
	};
	/**
	 * Reads all slash commands of the provided directory
	 * @param {string} slashCommandPath The slash command directory
	 */
	public async readSlashCommands(slashCommandPath: string) {
		let i = 0;
		for (const file of readdirSync(join(__dirname, slashCommandPath))) {
			if (lstatSync(join(__dirname, slashCommandPath, file)).isDirectory()) this.readSlashCommands(join(slashCommandPath, file));
			else if (!this.ignoreFiles.includes(file)) {
				if (!file.endsWith(".ts")) {
					clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
					continue;
				};
				const { default: SlashCommand } = await import(join(__dirname, slashCommandPath, file));
				const slashCommand: SlashCommand = new SlashCommand();
				this.slashCommands.set(slashCommand.name, slashCommand);
				i++;
			};
		};
		return i;
	};
	/**
	 * Creates an error and sends it to the channel
	 * @param {Message} message The created message 
	 * @param {object} embed The embed object 
	 * @param {string} usage The command usage
	 */
	public async createArgumentError(message: Message, embed: { title: string, description: string }, usage: string) {
		return message.channel.send(this.createRedEmbed(true, `${message.guild ? (await this.cache.getGuild(message.guild.id)).prefix : this.globalPrefix}${usage}`)
			.setTitle(embed.title)
			.setDescription(embed.description));
	};
	/**
	 * Creates a success message and sends it to the channel
	 * @param {Message} message The created message 
	 * @param {object} embed The embed object 
	 * @param {string} usage The command usage 
	 */
	public async createSuccess(message: Message, embed: { title: string, description: string }, usage?: string) {
		return message.channel.send(this.createGreenEmbed(usage ? true : false, usage ? `${message.guild ? (await this.cache.getGuild(message.guild.id)).prefix : this.globalPrefix}${usage}` : null)
			.setTitle(embed.title)
			.setDescription(embed.description));
	};
	/**
	 * Creates a help table for sub commands and sends it to the channel
	 * @param {Message} message The created message 
	 * @param {object} embed The embed object
	 * @param {Array<object>} commands The sub commands
	 */
	public async createEmbedForSubCommands(message: Message, embed: { title: string, description?: string }, commands: Array<{ usage: string, description: string }>) {
		const EMBED = this.createEmbed().setTitle(embed.title);
		const prefix = message.guild ? (await this.cache.getGuild(message.guild.id)).prefix : this.globalPrefix;
		for (const command of commands) EMBED.addField(this.util.toUpperCaseBeginning(command.description), `\`${prefix}${command.usage}\``);
		if (embed.description) EMBED.setDescription(embed.description);
		return message.channel.send(EMBED);
	};
	/**
	 * Creates an embed with the default embed color
	 * @param {boolean} usageField If it is true, it adds a usage field 
	 * @param {string} usage The command usage
	 */
	public createEmbed(usageField?: boolean, usage?: StringResolvable): MessageEmbed {
		if (usageField) {
			return new MessageEmbed({
				color: this.defaultColor,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true }),
				},
				fields: [{
					name: '🤔 Usage:',
					value: `${this.arrowEmoji} \`${usage}\``
				}],
			}).setTimestamp();
		} else {
			return new MessageEmbed({
				color: this.defaultColor,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true }),
				}
			}).setTimestamp();
		};
	};
	/**
	 * Creates an embed with green embed color
	 * @param {boolean} usageField If it is true, it adds a usage field 
	 * @param {string} usage The command usage
	 */
	public createGreenEmbed(usageField?: boolean, usage?: StringResolvable): MessageEmbed {
		if (usageField) {
			return new MessageEmbed({
				color: this.util.greenColorHex,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true }),
				},
				fields: [{
					name: '🤔 Usage:',
					value: `${this.arrowEmoji} \`${usage}\``
				}],
			}).setTimestamp();
		} else {
			return new MessageEmbed({
				color: this.util.greenColorHex,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true }),
				}
			}).setTimestamp();
		};
	};
	/**
	 * Creates an embed with yellow embed color
	 * @param {boolean} usageField If it is true, it adds a usage field 
	 * @param {string} usage The command usage
	 */
	public createYellowEmbed(usageField?: boolean, usage?: StringResolvable): MessageEmbed {
		if (usageField) {
			return new MessageEmbed({
				color: this.util.yellowColorHex,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true }),
				},
				fields: [{
					name: '🤔 Usage:',
					value: `${this.arrowEmoji} \`${usage}\``
				}],
			}).setTimestamp();
		} else {
			return new MessageEmbed({
				color: this.util.yellowColorHex,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true }),
				}
			}).setTimestamp();
		};
	};
	/**
	 * Creates an embed with red embed color
	 * @param {boolean} usageField If it is true, it adds a usage field 
	 * @param {string} usage The command usage
	 */
	public createRedEmbed(usageField?: boolean, usage?: StringResolvable): MessageEmbed {
		if (usageField) {
			return new MessageEmbed({
				color: this.util.redColorHex,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true }),
				},
				fields: [{
					name: '🤔 Usage:',
					value: `${this.arrowEmoji} \`${usage}\``
				}]
			}).setTimestamp();
		} else {
			return new MessageEmbed({
				color: this.util.redColorHex,
				footer: {
					text: "Created By HydraNhani",
					iconURL: this.user.displayAvatarURL({ dynamic: true })
				}
			}).setTimestamp();
		};
	};
	//GET EMOJI ID\\
	/**
	 * Gets the emoji ID from the "unicode" of the custom emoji
	 * @param {string} emoji The emoji
	 */
	private getEmojiID(emoji: string): string {
		return emoji.split(":")[2].split(">")[0];
	};
	//AUTO FILTER DATABASE\\
	/**
	 * Filters the database after every start
	 * @param {boolean} enable If it is enabled, this automatically filters the database to clear storage
	 */
	private async DBfilter(enable: boolean = false) {
		if (!enable) return;
		//GIVEAWAYS\\
		const giveaways = await GiveawaySchema.find({});
		for (const giveaway of giveaways) this.giveaways.endGiveaway(giveaway.messageID);
		//DROPS\\
		const drops = await DropSchema.find({});
		for (const drop of drops) deleteDrop(drop.messageID);
		//TICKETS\\
		const tickets = await TicketSchema.find({});
		for (const ticket of tickets) {
			const check = this.channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').get(ticket.channelID);
			if (!check) await TicketSchema.findOneAndDelete({
				channelID: ticket.channelID
			});
		};
		//GUILDS\\
		const guilds = await GuildSchema.find({});
		for (const guild of guilds) {
			const check = this.guilds.cache.get(guild.guildID);
			if (!check) await GuildSchema.findOneAndDelete({
				guildID: guild.guildID
			});
		};
		//MESSAGES AND LEVEL\\
		const levels = await LevelSchema.find({});
		for (const level of levels) {
			const guildCheck = this.guilds.cache.get(level.guildID);
			if (guildCheck) {
				const memberCheck = guildCheck.members.cache.get(level.userID);
				if (!memberCheck) await LevelSchema.findOneAndDelete({
					guildID: level.guildID,
					userID: level.userID
				});
			} else await GuildSchema.findOneAndDelete({
				guildID: level.guildID
			});
		};
	};
	public async modLogWebhook(guildID: string, embed: MessageEmbed) {
		const guildSettings = await this.cache.getGuild(guildID);
		if (guildSettings) {
			if (guildSettings.modLogChannelID && guildSettings.modLogChannelWebhookID && guildSettings.modLogChannelWebhookToken) {
				const channel = this.channels.cache.get(guildSettings.modLogChannelID) as TextChannel | NewsChannel;
				if (channel) {
					const webhooks = await channel.fetchWebhooks();
					if (webhooks.has(guildSettings.modLogChannelWebhookID)) {
						const webhook = new WebhookClient(guildSettings.modLogChannelWebhookID, guildSettings.modLogChannelWebhookToken, {
							partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]
						});
						webhook.send(embed);
					};
				};
			};
		};
	};
	public getApp(guildID?: string) {
		//@ts-ignore
		const app = this.api.applications(this.user.id);
		if (guildID) app.guilds(guildID);
		return app;
	};
	public async connectToMongoDB(url: string, options?: ConnectionOptions) {
		await connect(url, {
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			...options
		});
		set('useNewUrlParser', true);
		set('useFindAndModify', false);
		set('useUnifiedTopology', true);
		set('useCreateIndex', true);
		return connection;
	};
};