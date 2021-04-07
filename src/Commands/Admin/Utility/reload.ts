import Command, { CommandRunner } from "@root/Command";

export default class ReloadCommand extends Command {
    constructor(){
        super({
            name: "reload",
            description: "reloades all commands. events and features",
            category: "developer",
            developerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        await client.start();
        return client.createSuccess(message, { title: "File Manager", description: "Reloaded all commands!"});
    };
};