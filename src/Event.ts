import GalaxyAlpha from '@root/Client';
import { EventEmitter } from 'events';
import { Bot } from "@root/index";

export interface EventRunner {
	(client: GalaxyAlpha, ...params: unknown[]): Promise<unknown>;
};

interface EventInfos {
	name: string;
	emitter?: EventEmitter
};

export default class Event {
	private client: GalaxyAlpha = Bot;
	public name: string;
	/**
	 * @param {EventInfos} info The event informations
	 */
	constructor(info: EventInfos) {
		this.name = info.name;
		this.validateInfo({
			name: this.name
		});
	};
	validateInfo(info: {
		name: string
	}) {
		if (!info.name) throw new Error("A event name must be specified!");
		if (typeof info.name != 'string') throw new TypeError("The event name must be a string!");
		if (!this.client.util.validEvents.includes(info.name)) throw new Error(`Invalid event: ${info.name}`);
	};
	run = async (client: GalaxyAlpha, ...params: unknown[]): Promise<unknown> => {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};
