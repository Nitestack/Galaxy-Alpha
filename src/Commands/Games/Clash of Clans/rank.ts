import Command, { CommandRunner } from "@root/Command";
import { cocEmoji, ENDPOINTS, getLocation, headers, isLocation, manager } from "@commands/Games/Clash of Clans/Constants";
import { MessageEmbed } from "discord.js";
import axios from "axios";

export default class RankCommand extends Command {
    constructor() {
        super({
            name: "coc-rank",
            description: "shows ranks",
            category: "games"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[0]?.toLowerCase() == "clan") {
            const locationID: number | string = args.slice(1).join(" ") && await isLocation(args.slice(1).join(" "), true) ? await isLocation(args.slice(1).join(" "), true) : "global";
            const location = locationID != "global" ? await getLocation(locationID as number) : "Global";
            const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.LOCATIONS}/${locationID}/rankings/clans?limit=200`, {
                method: "GET",
                headers: headers
            });
            const responseJSON = response.data;
            const clans: Array<{
                tag: string,
                name: string,
                location: {
                    localizedName?: string
                    id: number,
                    name: string,
                    isCountry: boolean,
                    countryCode?: string
                },
                badgeUrls: {
                    small: string,
                    large: string,
                    medium: string
                },
                clanLevel: number,
                members: number,
                clanPoints: number,
                rank: number,
                previousRank: number
            }> = responseJSON.items;
            const embedArray: Array<MessageEmbed> = [];
            let k = 5;
            for (let i = 0; i < clans.length; i += 5) {
                const current = clans.slice(i, k);
                k += 5;
                let text: string = "";
                for (const clan of current) text += `${clan.rank == 1 ? "🥇" : (clan.rank == 2 ? "🥈" : (clan.rank == 3 ? "🥉" : `\`${clan.rank}.\``))} **__${clan.name}__**
                #️⃣ Tag: \`${clan.tag}\`
                📌 Location: \`${clan.location.name}\`
                *️⃣ Level: \`${clan.clanLevel}\`
                ${client.memberEmoji} Members: \`${clan.members}\`
                ⏺️ Clan Points: \`${clan.clanPoints}\`
                ⬅️ Previous Rank: \`${clan.previousRank}\`\n\n`;
                embedArray.push(client.createEmbed().setTitle(`${cocEmoji} Clan Ranking`).setDescription(`**Region:** ${location != "Global" ? location.name : "Global"}\n\n${text}`));
            };
            let page: number = 0;
            const msg = await message.channel.send(embedArray[0]);
            await msg.react('🏠');
            await msg.react('◀️');
            await msg.react('▶️');
            const Buttons = msg.createReactionCollector((reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == '🏠') && user.id == message.author.id, { time: 24 * 60 * 60 * 1000 });
            Buttons.on('collect', async (reaction, user) => {
                if (reaction.emoji.name == '◀️') {
                    if (page == 0) {
                        await msg.edit(embedArray[embedArray.length - 1]);
                        page = embedArray.length - 1;
                    } else {
                        page--;
                        await msg.edit(embedArray[page]);
                    };
                } else if (reaction.emoji.name == '▶️') {
                    if (page == embedArray.length - 1) {
                        await msg.edit(embedArray[0]);
                        page = 0;
                    } else {
                        page++;
                        await msg.edit(embedArray[page]);
                    };
                } else {
                    if (page != 0) {
                        await msg.edit(embedArray[0]);
                        page = 0;
                    };
                };
            });
        } else if (args[0]?.toLowerCase() == "player") {
            const locationID: number | string = args.slice(1).join(" ") && await isLocation(args.slice(1).join(" "), true) ? await isLocation(args.slice(1).join(" "), true) : "global";
            const location = locationID != "global" ? await getLocation(locationID as number) : "Global";
            const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.LOCATIONS}/${locationID}/rankings/players?limit=200`, {
                method: "GET",
                headers: headers
            });
            const responseJSON = response.data;
            const players: Array<{
                tag: string,
                name: string,
                expLevel: number,
                trophies: number,
                attackWins: number,
                defenseWins: number,
                rank: number,
                previousRank: number,
                clan: {
                    tag: string,
                    name: string,
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
                }
            }> = responseJSON.items;
            const embedArray: Array<MessageEmbed> = [];
            let k = 5;
            for (let i = 0; i < players.length; i += 5) {
                const current = players.slice(i, k);
                k += 5;
                let text: string = "";
                for (const player of current) text += `${player.rank == 1 ? "🥇" : (player.rank == 2 ? "🥈" : (player.rank == 3 ? "🥉" : `\`${player.rank}.\``))} **__${player.name}__**
                #️⃣ Tag: \`${player.tag}\`
                *️⃣ Level: \`${player.expLevel}\`
                🏆 Trophies: \`${player.trophies}\`
                📍 League: \`${player.league.name}\`
                ⚔️ Won Attacks: \`${player.attackWins}\`
                🛡️ Won Defenses: \`${player.defenseWins}\`
                ⬅️ Previous Rank: \`${player.previousRank}\`\n\n`;
                embedArray.push(client.createEmbed().setTitle(`${cocEmoji} Player Ranking`).setDescription(`**Region:** ${location != "Global" ? location.name : "Global"}\n\n${text}`));
            };
            let page: number = 0;
            const msg = await message.channel.send(embedArray[0]);
            if (embedArray.length > 1) {
                await msg.react('🏠');
                await msg.react('◀️');
                await msg.react('▶️');
                const Buttons = msg.createReactionCollector((reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == '🏠') && user.id == message.author.id, { time: 24 * 60 * 60 * 1000 });
                Buttons.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name == '◀️') {
                        if (page == 0) {
                            await msg.edit(embedArray[embedArray.length - 1]);
                            page = embedArray.length - 1;
                        } else {
                            page--;
                            await msg.edit(embedArray[page]);
                        };
                    } else if (reaction.emoji.name == '▶️') {
                        if (page == embedArray.length - 1) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        } else {
                            page++;
                            await msg.edit(embedArray[page]);
                        };
                    } else {
                        if (page != 0) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        };
                    };
                });
            };
        } else if (args[0]?.toLowerCase() == "playerversus") {
            const locationID: number | string = args.slice(1).join(" ") && await isLocation(args.slice(1).join(" "), true) ? await isLocation(args.slice(1).join(" "), true) : "global";
            const location = locationID != "global" ? await getLocation(locationID as number) : "Global";
            const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.LOCATIONS}/${locationID}/rankings/players-versus?limit=200`, {
                method: "GET",
                headers: headers
            });
            const responseJSON = response.data;
            const players: Array<{
                tag: string,
                name: string,
                expLevel: number,
                rank: number,
                previousRank: number,
                versusTrophies: number,
                clan: {
                    tag: string,
                    name: string,
                    badgeUrls: {
                        small: string,
                        large: string,
                        medium: string
                    }
                },
                versusBattleWins: number
            }> = responseJSON.items;
            const embedArray: Array<MessageEmbed> = [];
            let k = 5;
            for (let i = 0; i < players.length; i += 5) {
                const current = players.slice(i, k);
                k += 5;
                let text: string = "";
                for (const player of current) text += `${player.rank == 1 ? "🥇" : (player.rank == 2 ? "🥈" : (player.rank == 3 ? "🥉" : `\`${player.rank}.\``))} **__${player.name}__**
                #️⃣ Tag: \`${player.tag}\`
                *️⃣ Level: \`${player.expLevel}\`
                🏆 Trophies: \`${player.versusTrophies}\`
                ⚔️ Versus Battle Wins: \`${player.versusBattleWins}\`
                ⬅️ Previous Rank: \`${player.previousRank}\`\n\n`;
                embedArray.push(client.createEmbed().setTitle(`${cocEmoji} Player Versus Ranking`).setDescription(`**Region:** ${location != "Global" ? location.name : "Global"}\n\n${text}`));
            };
            let page: number = 0;
            const msg = await message.channel.send(embedArray[0]);
            if (embedArray.length > 1) {
                await msg.react('🏠');
                await msg.react('◀️');
                await msg.react('▶️');
                const Buttons = msg.createReactionCollector((reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == '🏠') && user.id == message.author.id, { time: 24 * 60 * 60 * 1000 });
                Buttons.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name == '◀️') {
                        if (page == 0) {
                            await msg.edit(embedArray[embedArray.length - 1]);
                            page = embedArray.length - 1;
                        } else {
                            page--;
                            await msg.edit(embedArray[page]);
                        };
                    } else if (reaction.emoji.name == '▶️') {
                        if (page == embedArray.length - 1) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        } else {
                            page++;
                            await msg.edit(embedArray[page]);
                        };
                    } else {
                        if (page != 0) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        };
                    };
                });
            };
        } else if (args[0]?.toLowerCase() == "clanversus") {
            const locationID: number | string = args.slice(1).join(" ") && await isLocation(args.slice(1).join(" "), true) ? await isLocation(args.slice(1).join(" "), true) : "global";
            const location = locationID != "global" ? await getLocation(locationID as number) : "Global";
            const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.LOCATIONS}/${locationID}/rankings/clans-versus?limit=200`, {
                method: "GET",
                headers: headers
            });
            const responseJSON = response.data;
            const clans: Array<{
                tag: string,
                name: string,
                location: {
                  id: number,
                  name: string,
                  isCountry: boolean,
                  countryCode: string
                },
                badgeUrls: {
                  small: string,
                  large: string,
                  medium: string
                },
                clanLevel: number,
                members: number,
                rank: number,
                previousRank: number,
                clanVersusPoints: number
            }> = responseJSON.items;
            const embedArray: Array<MessageEmbed> = [];
            let k = 5;
            for (let i = 0; i < clans.length; i += 5) {
                const current = clans.slice(i, k);
                k += 5;
                let text: string = "";
                for (const clan of current) text += `${clan.rank == 1 ? "🥇" : (clan.rank == 2 ? "🥈" : (clan.rank == 3 ? "🥉" : `\`${clan.rank}.\``))} **__${clan.name}__**
                #️⃣ Tag: \`${clan.tag}\`
                📌 Location: \`${clan.location.name}\`
                *️⃣ Level: \`${clan.clanLevel}\`
                ${client.memberEmoji} Members: \`${clan.members}\`
                ⏺️ Clan Points: \`${clan.clanVersusPoints}\`
                ⬅️ Previous Rank: \`${clan.previousRank}\`\n\n`;
                embedArray.push(client.createEmbed().setTitle(`${cocEmoji} Clan Versus Ranking`).setDescription(`**Region:** ${location != "Global" ? location.name : "Global"}\n\n${text}`));
            };
            let page: number = 0;
            const msg = await message.channel.send(embedArray[0]);
            if (embedArray.length > 1) {
                await msg.react('🏠');
                await msg.react('◀️');
                await msg.react('▶️');
                const Buttons = msg.createReactionCollector((reaction, user) => (reaction.emoji.name == '◀️' || reaction.emoji.name == '▶️' || reaction.emoji.name == '🏠') && user.id == message.author.id, { time: 24 * 60 * 60 * 1000 });
                Buttons.on('collect', async (reaction, user) => {
                    if (reaction.emoji.name == '◀️') {
                        if (page == 0) {
                            await msg.edit(embedArray[embedArray.length - 1]);
                            page = embedArray.length - 1;
                        } else {
                            page--;
                            await msg.edit(embedArray[page]);
                        };
                    } else if (reaction.emoji.name == '▶️') {
                        if (page == embedArray.length - 1) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        } else {
                            page++;
                            await msg.edit(embedArray[page]);
                        };
                    } else {
                        if (page != 0) {
                            await msg.edit(embedArray[0]);
                            page = 0;
                        };
                    };
                });
            };
        } else return client.createEmbedForSubCommands(message, {
            title: manager,
            description: "Commands to see different rankings in different regions!"
        }, [{
            usage: `${this.name} player [region]`,
            description: "Shows the TOP 200 players in a specific region"
        }, {
            usage: `${this.name} clan [region]`,
            description: "Shows the TOP 200 clans in a specific region"
        }, {
            usage: `${this.name} versus [region]`,
            description: "Shows the TOP 200 versus battle players in a specific region"
        }]);
    };
};