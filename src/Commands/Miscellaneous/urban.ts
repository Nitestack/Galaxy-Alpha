import Command, { CommandRunner } from "@root/Command";
import axios from "axios";

export default class UrbanCommand extends Command {
    constructor() {
        super({
            name: "urban",
            description: "searches a query in the urban dictionary",
            category: "miscellaneous"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "Urban Manager", description: "You have to provide a query to search for!" }, this.usage);
        const results = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(args.join(" "))}`);
        if (results.status != 200 || results.data?.list.length <= 0) return client.createArgumentError(message, { title: "Urban Manager", description: `Cannot find any results that includes \`${args.join(" ")}\`!` }, this.usage);
        const result = results.data.list[0];
        return message.channel.send(client.createEmbed()
            .setTitle(result.word)
            .setURL(result.permalink)
            .setDescription(client.util.embedDescriptionLimiter(result.definition))
            .setTimestamp(result.written_on)
            .setFooter(`👍 ${result.thumbs_up} | 👎 ${result.thumbs_down}`)
            .addField("Example:", result.example));
    };
};