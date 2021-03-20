import { PermissionString, Message } from 'discord.js';
import GalaxyAlpha from '@root/Client';
import { Guild } from '@models/guild';

export interface CommandRunner {
	(client: GalaxyAlpha, message: Message, args: {}, prefix: string): Promise<unknown>;
};

export type Categories = "miscellaneous"
	| "ticket"
	| "giveaway"
	| "currency"
	| "music"
	| "utility"
	| "management"
	| "moderation"
	| "developer"
	| "private"
	| "games"
	| "fun";

interface CommandInfos {
	name: string;
	args?: Array<{
		type?: Argument;
		required?: boolean;
		errorTitle?: string;
		errorMessage?: string;
		default?: (message: Message) => any | Promise<any>;
		certainStrings?: Array<string>;
		filter?: (message: Message, arg: any) => boolean | Promise<boolean>;
	}>;
	aliases?: Array<string>;
	description: string;
	category: Categories;
	usage?: string;
	cooldown?: string;
	userPermissions?: Array<PermissionString>;
	clientPermissions?: Array<PermissionString>;
	requiredRoles?: Array<keyof Guild>
	developerOnly?: boolean;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	dmOnly?: boolean;
	newsChannelOnly?: boolean;
	textChannelOnly?: boolean;
	subCommands?: Array<SubCommand>;
};

type Argument = "member"
	| "realUser"
	| "user"
	| "realMember"
	| "member"
	| "messageChannel"
	| "string"
	| "number"
	| "text"
	| "certainString"
	| "guild"
	| "custom"

export interface SubCommand {
	name: string;
	description: string;
	usage?: string;
	userPermissions?: Array<PermissionString>;
	clientPermissions?: Array<PermissionString>;
	requiredRoles?: Array<keyof Guild>
	developerOnly?: boolean;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	dmOnly?: boolean;
	newsChannelOnly?: boolean;
	textChannelOnly?: boolean;
	function: (client: GalaxyAlpha, message: Message, args: {}, prefix: string) => Promise<unknown>;
};

export default class Command {
	public name: string;
	public aliases?: Array<string>;
	public description: string;
	public category: Categories;
	public usage?: string;
	public cooldown?: string;
	public userPermissions?: Array<PermissionString>;
	public clientPermissions?: Array<PermissionString>;
	public developerOnly?: boolean;
	public ownerOnly?: boolean;
	public guildOnly?: boolean;
	public dmOnly?: boolean;
	public newsChannelOnly?: boolean;
	public textChannelOnly?: boolean;
	public requiredRoles?: Array<keyof Guild>;
	public subCommands?: Array<SubCommand>;
	public args?: Array<{
		type?: Argument;
		required?: boolean;
		errorTitle?: string;
		errorMessage?: string;
		default?: (message: Message) => any | Promise<any>;
		filter?: (message: Message, arg: any) => boolean | Promise<boolean>;
		certainStrings?: Array<string>;
	}>;
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
		this.newsChannelOnly = info.newsChannelOnly ? info.newsChannelOnly : false;
		this.textChannelOnly = info.textChannelOnly ? info.textChannelOnly : false;
		this.requiredRoles = info.requiredRoles ? info.requiredRoles : null;
		this.subCommands = info.subCommands ? info.subCommands : null;
		this.args = info.args ? info.args : null;
	};
	public run: CommandRunner = async (client: GalaxyAlpha, message: Message, args: Array<any>, prefix: string): Promise<unknown> => {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};