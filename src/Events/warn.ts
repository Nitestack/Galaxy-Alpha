import GalaxyAlpha from '@root/Client';
import Event from '@root/Event';

export const name: string = 'warn';

module.exports = class WarnEvent extends Event {
    constructor(client) {
        super(client, {
            name: "warn"
        });
    };
    async run(client: GalaxyAlpha, info: string) {
        console.log(info);
    };
};  