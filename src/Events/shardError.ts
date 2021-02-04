import GalaxyAlpha from '@root/Client';
import Event from '@root/Event';

module.exports = class ShardErrorEvent extends Event {
	constructor() {
		super({
			name: "shardError"
		});
	};
	async run(client: GalaxyAlpha, error: Error, shardID: number) {
		console.log(`Error on Shard ${shardID}\nError:\n${error}`);
	};
};