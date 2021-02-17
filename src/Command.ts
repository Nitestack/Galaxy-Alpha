import Discord from 'discord.js';
import GalaxyAlpha from '@root/Client';

export interface CommandRunner {
	(client: GalaxyAlpha, message: Discord.Message, args: Array<string>, prefix: string): Promise<unknown>;
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

interface CommandInfos {
	name: string;
	aliases?: Array<string>;
	description: string;
	category: Categories;
	usage?: string;
	cooldown?: string;
	userPermissions?: Array<Discord.PermissionString>;
	clientPermissions?: Array<Discord.PermissionString>;
	developerOnly?: boolean;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	dmOnly?: boolean;
	nsfw?: boolean;
	newsChannelOnly?: boolean;
	textChannelOnly?: boolean;
};

export default class Command {
	public name: string;
	public aliases?: Array<string>;
	public description: string;
	public category: Categories;
	public usage?: string;
	public cooldown?: string;
	public userPermissions?: Array<Discord.PermissionString>;
	public clientPermissions?: Array<Discord.PermissionString>;
	public developerOnly?: boolean;
	public ownerOnly?: boolean;
	public guildOnly?: boolean;
	public dmOnly?: boolean;
	public nsfw?: boolean;
	public newsChannelOnly?: boolean;
	public textChannelOnly?: boolean;
	/**
	 * @param {CommandInfo} info The command informations
	 */
	constructor(info: CommandInfos) {
		this.name = info.name ? info.name : null;
		this.aliases = info.aliases ? info.aliases : null;
		this.description = info.description ? info.description : null;
		this.category = info.category ? info.category : null;
		this.usage = info.usage ? info.usage : info.name;
		this.cooldown = info.cooldown ? info.cooldown : "3s";
		this.userPermissions = info.userPermissions ? info.userPermissions : null;
		this.clientPermissions = info.clientPermissions ? info.clientPermissions : null;
		this.developerOnly = info.developerOnly ? info.developerOnly : false;
		this.ownerOnly = info.ownerOnly ? info.ownerOnly : false;
		this.guildOnly = info.guildOnly ? info.guildOnly : false;
		this.dmOnly = info.dmOnly ? info.dmOnly : false;
		this.nsfw = info.nsfw ? info.nsfw : false;
		this.newsChannelOnly = info.newsChannelOnly ? info.newsChannelOnly : false;
		this.textChannelOnly = info.textChannelOnly ? info.textChannelOnly : false;
	};
	public run: CommandRunner = async (client: GalaxyAlpha, message: Discord.Message, args: Array<string>, prefix: string): Promise<unknown> => {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};