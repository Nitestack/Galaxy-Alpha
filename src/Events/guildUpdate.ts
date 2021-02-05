import Event, { EventRunner } from '@root/Event';
import { Guild, Role } from 'discord.js';

export default class GuildUpdateEvent extends Event {
    constructor(){
        super({
            name: "guildUpdate"
        });
    };
    run: EventRunner = async (client, oldGuild: Guild, newGuild: Guild) => {
        let role: Role;
        if (oldGuild.premiumSubscriptionCount != newGuild.premiumSubscriptionCount){
            newGuild.members.cache.filter(member => member.premiumSince ? true : false).forEach(member => {
                if (member.premiumSinceTimestamp == Date.now()){
                    member.roles.add(role.id);
                };
            });
        };
    };
};