import Event, { EventRunner } from '@root/Event';

export default class ShardErrorEvent extends Event {
	constructor() {
		super({
			name: "shardError"
		});
	};
	run: EventRunner = async (client, error: Error, shardID: number) => {
		console.log(`Error on Shard ${shardID}\nError:\n${error}`);
	};
};