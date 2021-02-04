import GalaxyAlpha from '@root/Client';
import Event from '@root/Event';

module.exports = class ErrorEvent extends Event {
	constructor(client){
		super(client, {
			name: "error"
		});
	};
	async run(client: GalaxyAlpha, error: Error){
		console.log(error);
	};
};