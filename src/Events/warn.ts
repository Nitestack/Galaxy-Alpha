import Event from '@root/Event';

export const name: string = 'warn';

module.exports = class WarnEvent extends Event {
    constructor(client) {
        super(client, {
            name: "warn"
        });
    };
    async run(client, info: string) {
        console.log(info);
    };
};  