import Command, { CommandRunner } from "@root/Command";
import { giveawayCreate } from "@commands/Giveaway/giveawaycreate";

export default class GiveawayScheduleCommand extends Command {
    constructor(){
        super({
            name: "giveawayschedule",
            description: "schedules a giveaway",
            category: "giveaway",
            guildOnly: true,
            aliases: ["gschedule"]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return client.commands.get(giveawayCreate).run(client, message, args, prefix);
    };
};