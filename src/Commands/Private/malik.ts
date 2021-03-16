import Command, { CommandRunner } from "@root/Command";

export default class extends Command {
    constructor() {
        super({
            name: "malik",
            description: "shows a picture of Malik",
            category: "private"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return message.channel.send(client.createEmbed()
            .setImage("https://cdn.discordapp.com/attachments/700278137270829197/821066447459450880/Anmerkung_2020-08-24_192311.png"));
    };
};