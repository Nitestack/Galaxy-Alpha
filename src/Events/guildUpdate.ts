import Event from '@root/Event';
import { Guild, Role } from 'discord.js';

module.exports = class GuildUpdateEvent extends Event {
    constructor(client){
        super(client, {
            name: "guildUpdate"
        });
    };
    async run(client, oldGuild: Guild, newGuild: Guild){
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