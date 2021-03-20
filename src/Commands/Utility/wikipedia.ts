import Command, { CommandRunner } from "@root/Command";
import wiki from "wikipedia";

export default class WikipediaCommand extends Command {
    constructor() {
        super({
            name: "wikipedia",
            description: "searches a wikipedia article",
            category: "utility",
            aliases: ["wiki"],
            usage: "wikipedia <query>",
            args: [{
                type: "text",
                required: true,
                errorTitle: "Wikipedia Manager",
                errorMessage: "You have to provide a query to search!"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        try {
            const page = await wiki.page(args[0]);
            const intro = await page.intro();
            return message.channel.send(client.createEmbed()
                .setTitle(page.title)
                .setURL(page.fullurl)
                .setDescription(client.util.embedFormatter.description(intro))
                .setThumbnail((await page.images())[0].url));
        } catch (error) {
            return client.createArgumentError(message, { title: "Wikipedia Manager", description: `Cannot find any results, that includes\n\`${args[0]}\`` }, this.usage);
        };
    };
};