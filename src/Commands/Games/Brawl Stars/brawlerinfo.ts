import Command, { CommandRunner } from "@root/Command";
import axios from "axios";
import { ENDPOINTS, headers, manager } from "@commands/Games/Brawl Stars/Constants";

export default class BrawlerInfo extends Command {
    constructor(){
        super({
            name: "bs-brawlerinfo",
            description: "get's some infos about a specific brawler",
            category: "games",
            usage: "bs-brawlerinfo <brawler name>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.BRAWLERS}`, {
            headers: headers,
            method: "GET"
        });
        const brawlers: Array<{
            id: number,
            name: string,
            starPowers: {
                id: number,
                name: string
            },
            gadgets: {
                id: number,
                name: string
            }
        }> = response.data.items;
        const brawler = brawlers.find(brawler => args.join(" ").split(" ").join("_").toUpperCase() == brawler.name)
        if (brawler) {
            return message.channel.send(client.createEmbed()
                .setTitle(client.util.toUpperCaseBeginning(brawler.name.split("_").join(" ")))
                .setDescription(""));
        } else return client.createArgumentError(message, { title: manager, description: "You have to provide a brawler name!" }, this.usage);
    };
};