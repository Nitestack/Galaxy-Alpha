import GalaxyAlpha from '@root/Client';
import { EventEmitter } from 'events';

export interface EventRunner {
	(client: GalaxyAlpha, ...params: unknown[]): Promise<unknown>;
};

interface EventInfos {
	name: string;
	emitter?: EventEmitter
};

export default class Event {
	public name: string;
	/**
	 * @param {EventInfos} info The event informations
	 */
	constructor(info: EventInfos) {
		this.name = info.name;
	};
	public run: EventRunner = async (client: GalaxyAlpha, ...params: unknown[]): Promise<unknown> => {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	};
};
