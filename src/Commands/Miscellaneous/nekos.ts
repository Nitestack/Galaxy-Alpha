import Command from '@root/Command';
import axios from 'axios';

export default class NekosCommand extends Command {
    constructor() {
        super({
            name: "nekos",
            description: "sends random pictures of a category",
            usage: "nekos <keyword>",
            nsfw: true,
            category: "miscellaneous"
        });
    };
    async run(client, message, args, prefix) {
        if (args[0]) {
            axios.get(`https://nekos.life/api/v2/img/${args[0].toLowerCase()}`).then(result => {
                if ((!result && !result.data && !result.data.url) || result.data.msg == '404') return message.channel.send(client.createRedEmbed(true, `${prefix}nekos <keyword>`)
                    .setTitle("Nekos Manager")
                    .setDescription(`Cannot find any results, that includes \`${args[0].toLowerCase()}\`!`))
                return message.channel.send(client.createEmbed()
                    .setTitle(`Nekos - ${args[0][0].toUpperCase() + args[0].slice(1).toLowerCase()}`)
                    .setImage(result.data.url));
            });
        } else {
            return message.channel.send(client.createEmbed(true, `${prefix}${this.usage}`).setTitle("Nekos Manager"))
        };
    };
};