import Command, { CommandRunner } from "@root/Command";
import axios from "axios";
import { ENDPOINTS, headers, manager } from "./Constants";

export default class ClanInfoCommand extends Command {
    constructor() {
        super({
            name: "coc-claninfo",
            description: "shows some infos about a clan",
            category: "games"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: manager, description: "You have to provide a clan tag!" }, this.usage);
        const tag = args[0].replace(/#/g, "%23").toUpperCase();
        const response = await axios.get(`${ENDPOINTS.BASE_URL}/${ENDPOINTS.CLANS}/${tag}`, {
            method: "GET",
            headers: headers
        });
        if (response.status == 200) {
            const clan: {
                tag: string,
                name: string,
                type: "inviteOnly" | "open" | "closed",
                description: string,
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
                clanPoints: number,
                clanVersusPoints: number,
                requiredTrophies: number,
                warFrequency: "always" | "moreThanOncePerWeek" | "oncePerWeek" | "lessThanOncePerWeek" | "never" | "unknown",
                warWinStreak: number,
                warWins: number,
                warTies: number,
                isWarLogPublic: boolean,
                warLeague: {
                    id: number,
                    name: string
                },
                members: 50,
                memberList: Array<{
                    tag: string,
                    name: string,
                    role: "admin" | "member" | "leader" | "coLeader",
                    expLevel: number,
                    league: {
                        id: number,
                        name: string,
                        iconUrls: {
                            small: string,
                            tiny: string
                        }
                    },
                    trophies: number,
                    versusTrophies: number,
                    clanRank: number,
                    previousClanRank: number,
                    donations: number,
                    donationsReceived: number
                }>,
                labels: Array<{
                    id: number,
                    name: string,
                    iconUrls: {
                        small: string,
                        medium: string
                    }
                }>
            } = await response.data;
            return message.channel.send(client.createEmbed()
                .setTitle(clan.name)
                .setDescription(`${clan.description}
                
                #️⃣ Tag: \`${clan.tag}\`
                🏷️ Labels: ${clan.labels.map(label => `${client.guilds.cache.get("814092899431350332").emojis.cache.find(emoji => emoji.name.toLowerCase() == `coc_${label.name.toLowerCase().split(" ").join("_")}`)}`).join(" ")}
                📩 Type: \`${clan.type != "inviteOnly" ? client.util.toUpperCaseBeginning(clan.type) : "Invite only"}\`
                📌 Clan Location: \`${clan.location.name}\`
                ${client.memberEmoji} Members: \`${clan.members}\`
                🏆 Total Points: \`${clan.clanPoints}\`🏆   \`${clan.clanVersusPoints}\`🏆
                🏆 Required Trophies: \`${clan.requiredTrophies}\`🏆
                ⚔️ Wars Won: \`${clan.warWins}\`
                
                💯 War Win Streak: \`${clan.warWinStreak}\`
                👑 Clan Leader: \`${clan.memberList[clan.memberList.findIndex(member => member.role == "leader")].name}\`
                🔋 War Frequency: \`${clan.warFrequency != "unknown" && clan.warFrequency != "always" && clan.warFrequency != "never" ? (clan.warFrequency == "lessThanOncePerWeek" ? "Rarely" : (clan.warFrequency == "moreThanOncePerWeek" ? "Twice a week" : "Once a week")) : client.util.toUpperCaseBeginning(clan.warFrequency)}\`
                📊 Public War Log: \`${clan.isWarLogPublic ? "Yes" : "No"}\``)
                .setThumbnail(clan.badgeUrls.large));
        } else return client.createArgumentError(message, { title: manager, description: `Cannot find the clan with the tag \`${args[0]}\`` }, this.usage);
    };
};