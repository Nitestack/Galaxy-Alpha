import Event, { EventRunner } from '@root/Event';

export default class WarnEvent extends Event {
    constructor() {
        super({
            name: "warn"
        });
    };
    run: EventRunner = async (client, info: string) => {
        console.log(info);
    };
};