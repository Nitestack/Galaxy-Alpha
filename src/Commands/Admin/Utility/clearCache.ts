import Command, { CommandRunner } from "@root/Command";

export default class ClearCacheCommand extends Command {
    constructor() {
        super({
            name: "clearcache",
            description: "clears the cache and uploades the caches data",
            developerOnly: true,
            category: "developer"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!client.cache.levels.first() && !client.cache.currency.first()) return message.channel.send(client.createRedEmbed(true, `${prefix}${this.usage}`)
            .setTitle("Cache Manager")
            .setDescription("There is nothing in cache!"));
        client.cache.clearCacheAndSave();
        return message.channel.send(client.createGreenEmbed()
            .setTitle("Cache Manager")
            .setDescription("Cleared cache and uploaded cache data to the database!"));
    };
};