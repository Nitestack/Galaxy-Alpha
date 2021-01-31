import GalaxyAlpha from '@root/Client';
import { EventEmitter } from 'events';
import { validEvents } from '@root/util';

export interface EventRunner {
	(client: GalaxyAlpha, ...params: unknown[]): Promise<void>;
};

export default class Event {
	public name: string;
	constructor(client: GalaxyAlpha, info: {
		name?: string,
		emitter?: EventEmitter
	}){
		this.name = info.name;
		this.validateInfo(client, {
			name: this.name
		});
	};
	validateInfo(client: GalaxyAlpha, info: {
		name: string
	}){
		if (!client) throw new Error("A client must be specified!");
		if (!info.name) throw new Error("A event name must be specified!");
		if (typeof info.name != 'string') throw new TypeError("The event name must be a string!");
		if (!validEvents.includes(info.name)) throw new Error(`Invalid event: ${info.name}`);
	};
	async run(client: GalaxyAlpha, ...params: unknown[]): Promise<unknown> {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};
