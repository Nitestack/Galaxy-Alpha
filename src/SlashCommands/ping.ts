import SlashCommand, { SlashCommandRunner } from "@root/SlashCommand";

export default class PingSlashCommand extends SlashCommand {
    constructor(){
        super({
            name: "ping",
            description: "A simple ping command!",
            type: "message"
        });
    };
    run: SlashCommandRunner = async (client, interaction, args, infos) => {
    };
};