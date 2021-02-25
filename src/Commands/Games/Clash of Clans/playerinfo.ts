import Command, { CommandRunner } from "@root/Command";
import { ENDPOINTS, headers, manager } from "@commands/Games/Clash of Clans/Constants";
import axios from "axios";

export default class PlayerInfoCommand extends Command {
    constructor() {
        super({
            name: "coc-playerinfo",
            description: "shows the coc player infos",
            usage: "coc-player <tag>",
            category: "games"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: manager, description: "You have to provide a player tag!" }, this.usage);
        const tag = args[0].replace(/#/g, "%23");
        const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.PLAYERS}/${tag}`, {
            method: "GET",
            headers: headers
        });
        if (response.status == 200) {
            const player: {
                tag: string,
                name: string,
                townHallLevel: number,
                townHallWeaponLevel?: number,
                expLevel: number,
                trophies: number,
                bestTrophies: number,
                warStars: number,
                attackWins: number,
                defenseWins: number,
                builderHallLevel?: number,
                versusTrophies: number,
                bestVersusTrophies: number,
                versusBattleWins: number,
                role: "admin" | "member" | "leader" | "coLeader",
                donations: number,
                donationsReceived: number,
                clan: {
                    tag: string,
                    name: string,
                    clanLevel: number,
                    badgeUrls: {
                        small: string,
                        large: string,
                        medium: string
                    }
                },
                league: {
                    id: number,
                    name: string,
                    iconUrls: {
                        small: string,
                        tiny: string,
                        medium: string
                    }
                },
                legendStatistics?: {
                    legendTrophies: number,
                    previousSeason: {
                        id: string,
                        rank: number,
                        trophies: number
                    },
                    bestSeason: {
                        id: string,
                        rank: number,
                        trophies: number
                    },
                    bestVersusSeason: {
                        id: string,
                        rank: number,
                        trophies: number
                    },
                    currentSeason: {
                        rank: number,
                        trophies: number
                    }
                },
                achievements: Array<{
                    name: string,
                    stars: number,
                    value: number,
                    target: number,
                    info: string,
                    completionInfo: string,
                    village: "home" | "builderBase"
                }>,
                versusBattleWinCount: number,
                labels: Array<{
                    id: number,
                    name: string,
                    iconUrls: {
                        small: string,
                        medium: string
                    }
                }>,
                troops: Array<{
                    name: string,
                    level: number,
                    maxLevel: number,
                    village: "home" | "builderBase"
                }>,
                spells: Array<{
                    name: string,
                    level: number,
                    maxLevel: number,
                    village: "home"
                }>
            } = await response.data;
            console.log(player);
            return message.channel.send(client.createEmbed()
                .setTitle(player.name)
                .setDescription()
                .setImage(player.league.iconUrls.medium));
        } else return client.createArgumentError(message, { title: manager, description: `Cannot find the player with the tag \`${args[0]}\`` }, this.usage);
    };
};