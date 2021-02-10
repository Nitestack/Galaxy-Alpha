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
        if (!client.cache.levels.first() && !client.cache.currency.first() && !client.cache.guilds.first()) return client.createArgumentError(message, { title: "Cache Manager", description: "There is nothing in cache!"}, this.usage);
        client.cache.clearCacheAndSave();
        return client.createSuccess(message, { title: "Cache Manager", description: "Cleared cache and uploaded data to database!"});
    };
};