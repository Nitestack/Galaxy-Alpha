import Event, { EventRunner } from "@root/Event";

export default class extends Event {
    constructor() {
        super({
            name: "debug"
        });
    };
    run: EventRunner = async (client, info: string) => {
        console.log(info);
    };
};