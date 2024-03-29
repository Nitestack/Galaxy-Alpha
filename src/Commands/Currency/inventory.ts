import Command, { CommandRunner } from "@root/Command";
import { User } from "discord.js";

export default class InventoryCommand extends Command {
    constructor() {
        super({
            name: "inventory",
            description: "shows your inventory",
            aliases: ["inv"],
            category: "currency"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        await client.cache.increaseCurrencyMessageCount(message.author.id);
        let user: User = message.author;
        if (message.mentions.users.first() && client.users.cache.filter(user => !user.bot).has(message.mentions.users.first().id)) user = message.mentions.users.first();
        if (args[0] && client.users.cache.filter(user => !user.bot).has(args[0])) user = client.users.cache.get(args[0]);
        const userInventory = await client.cache.getCurrency(user.id);
        return message.channel.send(client.createEmbed()
            .setTitle("Currency Manager")
            .setDescription(`${userInventory.items.map(item => `${client.util.toUpperCaseBeginning(item.name)}\n**${item.aliases.length < 2 ? "ID" : "ID's"}**: \`${item.aliases?.length == 0 ? `${item.name}` : item.aliases.join("`, `")}\``)}`));
    };
};