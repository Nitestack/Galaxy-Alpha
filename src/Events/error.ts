import Event, { EventRunner } from '@root/Event';

export default class ErrorEvent extends Event {
	constructor(){
		super({
			name: "error"
		});
	};
	run: EventRunner = async (client, error: Error) => {
		console.log(error);
	};
};