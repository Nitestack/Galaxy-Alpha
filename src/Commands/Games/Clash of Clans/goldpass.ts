import Command, { CommandRunner } from "@root/Command";
import { ENDPOINTS, headers, manager } from "@commands/Games/Clash of Clans/Constants";
import axios from "axios";

export default class GoldPassCommand extends Command {
    constructor(){
        super({
            name: "coc-goldpass",
            description: "shows some infos about the current goldpass",
            category: "games"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const response = await axios.get(`${ENDPOINTS.BASE_URL}/goldpass/seasons/current`, {
            headers: headers,
            method: "GET"
        });
        if (response.status == 500) return client.createArgumentError(message, { title: manager, description: "There was an unknown error! Please try again!" }, this.usage);
    };
};