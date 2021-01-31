import Command from '@root/Command';
import { User } from 'discord.js';

module.exports = class InvitesCommand extends Command {
    constructor(client){
        super(client, {
            name: "invites",
            description: "get's the user's current invite stats",
            category: "miscellaneous",
            guildOnly: true,
            usage: "invites [@User/User ID]"
        });
    };
    async run(client, message, args, prefix) {
        let user: User = message.author;
        if (message.mentions.users.first() && message.guild.members.cache.has(message.mentions.users.first().id)) user = message.guild.members.cache.get(message.mentions.users.first().id).user;
        if (args[0] && message.guild.members.cache.has(args[0])) user = message.guild.members.cache.get(args[0]).user;
        return message.guild.fetch().then(guild => {
            guild.fetchInvites().then(inviteCollection => {
                let fakeInvites: number = 0;
                let totalInvites: number = 0;
                let leftInvites: number = 0;
                let invites: number = 0;
                inviteCollection.filter(invite => invite.inviter.id == user.id).forEach(invite => {
                    client.fetchInvite(invite.url).then(inviteFetched => {
                        totalInvites += inviteFetched.uses;
                        leftInvites += totalInvites - inviteFetched.memberCount;
                    });
                });
                return message.channel.send(client.createEmbed()
                    .setTitle("Invite Manager")
                    .setDescription(`${user} has \`${invites}\` invites (\`${totalInvites}\` total, \`${fakeInvites}\` ${fakeInvites == 1 ? 'fake' : 'fakes'}, \`${leftInvites}\` left)`));
            });
        });
    };
};