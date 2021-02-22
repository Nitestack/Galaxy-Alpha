import Command, { CommandRunner } from "@root/Command";

export default class EnableCommand extends Command {
    constructor(){
        super({
            name: "command",
            description: "enables or disables a command",
            category: "developer",
            developerOnly: true,
            usage: "command <command name> <enable/disable>"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (!args[0]) return client.createArgumentError(message, { title: "Command Manager", description: "You have to provide a command to enable/disable!" }, this.usage);
        const command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if (!command) return client.createArgumentError(message, { title: "Command Manager", description: `Cannot find the command \`${args[0]}\`!`}, this.usage);
        if (!args[1] || (args[1].toLowerCase() != "enable" && args[1].toLowerCase() != "disable")) return client.createArgumentError(message, { title: "Command Manager", description: "You have to specifiy, if you want to enable or disable this command!" }, this.usage);
        if (args[1].toLowerCase() == "enable" && !client.disabledCommands.has(command.name)) return client.createArgumentError(message, { title: "Command Manager", description: "This command is already enabled!" }, this.usage);
        if (args[1].toLowerCase() == "disable" && client.disabledCommands.has(command.name)) return client.createArgumentError(message, { title: "Command Manager", description: "This command is already disabled!" }, this.usage);
        if (args[1].toLowerCase() == "enable") client.disabledCommands.delete(command.name);
        if (args[1].toLowerCase() == "disable") client.disabledCommands.set(command.name, command);
        return client.createSuccess(message, { title: "Command Manager", description: `${args[1].toLowerCase() == "enable" ? "Enabled" : "Disabled"} the command \`${command.name}\`!`});
    };
};