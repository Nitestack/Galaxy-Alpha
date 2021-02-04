import GalaxyAlpha from '@root/Client';
import Event from '@root/Event';

export default class ErrorEvent extends Event {
	constructor(){
		super({
			name: "error"
		});
	};
	async run(client: GalaxyAlpha, error: Error){
		console.log(error);
	};
};