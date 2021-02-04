import Command from '@root/Command';
import axios from 'axios';

export default class MemeCommand extends Command {
    constructor(){
        super({
            name: "meme",
            description: "sends a random meme",
            category: "miscellaneous"
        });
    };
    async run(client, message, args, prefix) {
        const memeAPI: string = "https://meme-api.herokuapp.com/gimme";
        function meme() {
            axios.get(memeAPI).then(result => {
                if (!result.data.nsfw) {
                    const embed = client.createEmbed()
                        .setTitle(result.data.title)
                        .setURL(result.data.postLink)
                        .setImage(result.data.url);
                    return message.channel.send(embed);
                } else {
                    meme();
                }
            }).catch(err => console.log(err));
        };
        return meme();
    };
};