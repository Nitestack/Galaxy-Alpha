import Command, { CommandRunner } from "@root/Command";
import axios from "axios";

export default class PornCommand extends Command {
    constructor(){
        super({
            name: "porn",
            description: "sends a porn",
            category: "nsfw",
            nsfw: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "Porn Manager", description: "You have to provide a query to search!\nUse \"all\" to search over all videos!"}, this.usage);
        const apiKey = `https://www.eporner.com/api/v2/video/search/?query=${args.join(" ")}&per_page=1000&page=1&thumbsize=big&order=top-weekly&gay=0&format=json`;
        const results = await axios.get(apiKey);
        if (results.status == 200){
            const { data } = results;
            const video = data.videos[Math.round(client.util.getRandomArbitrary(0, data.videos.length))];
            return message.channel.send(client.createEmbed()
                .setTitle(video.title)
                .setURL(video.url)
                .setDescription(`**Keywords:** ${video.keywords}
                **Views:** ${video.views} views
                **Rate:** ${video.rate}
                **Added At:** ${video.added}
                **Length:** ${video.length_min}`)
                .setImage(video.default_thumb.src));
        } else return client.createArgumentError(message, { title: "Porn Manager", description: "An error happened while you used the command! Please try again!" }, this.usage);
    };
};