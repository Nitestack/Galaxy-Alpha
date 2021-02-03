import Command from "@root/Command";

module.exports = class ShuffleCommand extends Command {
    constructor(client){
        super(client, {
            name: "shuffle",
            description: "shuffles the current queue",
            category: "music",
            guildOnly: true
        });
    };
};