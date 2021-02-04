import Event from '@root/Event';
import { Message } from 'discord.js';
import GiveawaySchema from '@models/Giveaways/giveaways';
import DropSchema from '@models/Giveaways/drops';
import GalaxyAlpha from '@root/Client';

module.exports = class MessageDeleteEvent extends Event {
    constructor(client) {
        super(client, {
            name: "messageDelete"
        });
    };
    async run(client: GalaxyAlpha, message: Message) {
        if (message.embeds.length == 0) {
            client.snipes.set(message.channel.id, message);
        };
        await GiveawaySchema.findOne({
            messageID: message.id
        }, {}, {}, (err, giveaway) => {
            if (err) return console.log(err);
            if (giveaway) {
                return giveaway.delete();
            };
        });
        await DropSchema.findOne({
            messageID: message.id
        }, {}, {}, (err, drop) => {
            if (err) return console.log(err);
            if (drop) {
                return drop.delete();
            };
        });
    };
};