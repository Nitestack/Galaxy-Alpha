import Discord from 'discord.js';
import GalaxyAlpha from '@root/Client';

export interface CommandRunner {
	(client: GalaxyAlpha, message: Discord.Message, args: Array<string>, prefix: string): Promise<void>;
};

export type Categories =
	| "miscellaneous"
	| "ticket"
	| "giveaway"
	| "currency"
	| "music"
	| "utility"
	| "management"
	| "moderation"
	| "developer"
	| "private"
	| "games";

export default class Command {
	private client: GalaxyAlpha;
	public name: string;
	public aliases?: Array<string>;
	public description: string;
	public category: Categories;
	public usage?: string;
	public cooldown?: number;
	public userPermissions?: Array<Discord.PermissionString>;
	public clientPermissions?: Array<Discord.PermissionString>;
	public developerOnly?: boolean;
	public ownerOnly?: boolean;
	public guildOnly?: boolean;
	public dmOnly?: boolean;
	public nsfw?: boolean;
	public newsChannelOnly?: boolean;
	constructor(info: {
		name: string,
		aliases?: Array<string>,
		description: string,
		category: Categories,
		usage?: string,
		cooldown?: number,
		userPermissions?: Array<Discord.PermissionString>,
		clientPermissions?: Array<Discord.PermissionString>,
		developerOnly?: boolean,
		ownerOnly?: boolean,
		guildOnly?: boolean,
		dmOnly?: boolean,
		nsfw?: boolean,
		newsChannelOnly?: boolean
	}) {
		this.name = info.name ? info.name : null;
		this.aliases = info.aliases ? info.aliases : null;
		this.description = info.description ? info.description : null;
		this.category = info.category ? info.category : null;
		this.usage = info.usage ? info.usage : info.name;
		this.cooldown = info.cooldown ? info.cooldown : 3;
		this.userPermissions = info.userPermissions ? info.userPermissions : null;
		this.clientPermissions = info.clientPermissions ? info.clientPermissions : null;
		this.developerOnly = info.developerOnly ? info.developerOnly : false;
		this.ownerOnly = info.ownerOnly ? info.ownerOnly : false;
		this.guildOnly = info.guildOnly ? info.guildOnly : false;
		this.dmOnly = info.dmOnly ? info.dmOnly : false;
		this.nsfw = info.nsfw ? info.nsfw : false;
		this.newsChannelOnly = info.newsChannelOnly ? info.newsChannelOnly : false;
		this.validateInfo({
			name: this.name,
			aliases: this.aliases,
			description: this.description,
			category: this.category,
			usage: this.usage,
			cooldown: this.cooldown,
			userPermissions: this.userPermissions,
			clientPermissions: this.clientPermissions,
			developerOnly: this.developerOnly,
			ownerOnly: this.ownerOnly,
			guildOnly: this.guildOnly,
			dmOnly: this.dmOnly,
			nsfw: this.nsfw,
			newsChannelOnly: this.newsChannelOnly
		});
	};
	async run(client: GalaxyAlpha, message: Discord.Message, args: Array<string>, prefix: string): Promise<void> {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
	validateInfo(info: {
		name: string,
		aliases?: Array<string>,
		description: string,
		category: Categories,
		usage?: string,
		cooldown?: number,
		userPermissions?: Array<Discord.PermissionString>,
		clientPermissions?: Array<Discord.PermissionString>,
		developerOnly?: boolean,
		ownerOnly?: boolean,
		guildOnly?: boolean,
		dmOnly?: boolean,
		nsfw?: boolean,
		newsChannelOnly?: boolean
	}) {
		if (!info.name) throw new Error("A command name must be specified!");
		if (!info.description) throw new Error("A command description must be specified!");
		if (!info.category) throw new Error("A command category must be specified!");
		if (typeof info != 'object') throw new TypeError("The command infos must be an object!");
		if (typeof info.name != 'string') throw new TypeError("The command name must be a string!");
		if (info.name != info.name.toLowerCase()) throw new Error("The command name must be lowercase!");
		if (info.aliases && (!Array.isArray(info.aliases) || info.aliases.some(ali => typeof ali !== 'string'))) {
			throw new TypeError('Command aliases must be an Array of strings!');
		};
		if (info.aliases && info.aliases.some(ali => ali !== ali.toLowerCase())) {
			throw new RangeError('Command aliases must be lowercase!');
		};
		if (typeof info.description != "string") throw new TypeError("The command description must be a string!");
		if (typeof info.category != "string") throw new TypeError("The command category must be a string!");
		if (info.category != info.category.toLowerCase()) throw new RangeError("The command category must be in lowercase!");
		if (typeof info.usage != "string") throw new TypeError("The command usage must be a string!");
		if (info.cooldown && typeof info.cooldown != "number") throw new TypeError("The command cooldown must be a number in seconds!");
		if (info.userPermissions) {
			if (!Array.isArray(info.userPermissions)) throw new TypeError("The command user permissions must be an Array of strings!");
			for (const permission of info.userPermissions) if (!this.client.permissions.includes(permission)) throw new RangeError(`Invalid command user permission: ${permission}`);
		};
		if (info.clientPermissions) {
			if (!Array.isArray(info.clientPermissions)) throw new TypeError("The command client permissions must be an Array of strings!");
			for (const permission of info.clientPermissions) if (!this.client.permissions.includes(permission)) throw new RangeError(`Invalid command client permission: ${permission}`);
		};
	};
};