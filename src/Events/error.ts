import Event from '@root/Event';

module.exports = class ErrorEvent extends Event {
	constructor(client){
		super(client, {
			name: "error"
		});
	};
	async run(client, error: Error){
		console.log(error);
	};
};