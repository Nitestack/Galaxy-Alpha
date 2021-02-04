import GalaxyAlpha from '@root/Client';
import Event from '@root/Event';

module.exports = class ErrorEvent extends Event {
	constructor(){
		super({
			name: "error"
		});
	};
	async run(client: GalaxyAlpha, error: Error){
		console.log(error);
	};
};