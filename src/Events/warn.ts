import GalaxyAlpha from '@root/Client';
import Event from '@root/Event';

export default class WarnEvent extends Event {
    constructor() {
        super({
            name: "warn"
        });
    };
    async run(client: GalaxyAlpha, info: string) {
        console.log(info);
    };
};  