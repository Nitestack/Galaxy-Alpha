import GalaxyAlpha from '@root/Client';
import { ClientEvents } from "discord.js";

export interface EventRunner {
	(client: GalaxyAlpha, ...args: Array<unknown>): Promise<unknown>;
};

interface EventInfos {
	name: keyof ClientEvents;
};

export default class Event {
	public name: keyof ClientEvents;
	/**
	 * @param {EventInfos} info The event informations
	 */
	constructor(info: EventInfos) {
		this.name = info.name;
	};
	public run: EventRunner = async (client: GalaxyAlpha, ...args: Array<unknown>): Promise<unknown> => {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};
