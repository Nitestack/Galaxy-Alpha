import Command from '@root/Command';
import { MessageAttachment } from 'discord.js';

module.exports = class DiscordTermsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "discordterms",
            description: "sends the introduction of the Discord Terms of Service",
            aliases: ["discordtos"],
            category: "miscellaneous"
        });
    };
    async run(client, message, args, prefix) {
        const attachment = new MessageAttachment('https://cdn.discordapp.com/attachments/784325634716467213/789850652192014356/Screenshot_10.png');
        const discordtermsembed = client.createEmbed()
            .setDescription(`**Welcome to Discord! These Terms of Service (“Terms”), which include and hereby incorporate the [Privacy Policy](https://discord.com/privacy) (“Privacy Policy”), are a legal agreement between Discord Inc. and its related companies (the “Company,” “us,” “our,” or "we") and you ("you" or “your”). By using or accessing the Discord application (the “App”) or the [website](https://discord.com) (the "Site"), which are collectively referred to as the “Service,” you agree (i) that you are 13 years of age and the minimum age of digital consent in your country, (ii) if you are the age of majority in your jurisdiction or over, that you have read, understood, and accept to be bound by the Terms, and (iii) if you are between 13 (or the minimum age of digital consent, as applicable) and the age of majority in your jurisdiction, that your legal guardian has reviewed and agrees to these Terms.\n\nThe Company reserves the right to update these Terms, which we may do for reasons that include, but are not limited to, complying with changes to the law or reflecting enhancements to Discord. If the changes affect your usage of Discord or your legal rights, we’ll notify you no less than seven days before the changes take effect. Unless we state otherwise, your continued use of the Service after we post modifications will constitute your acceptance of and agreement to those changes. If you object to the changes, your recourse shall be to cease using the Service.**\n\n**Last modified:** May 7, 2020\n\n[Read the full Discord TOS here](https://discord.com/terms)`);
        return message.channel.send(attachment).then(msg => {
            return message.channel.send(discordtermsembed);
        });
    };
};