"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class EnableCommand extends Command_1.default {
    constructor() {
        super({
            name: "command",
            description: "enables or disables a command",
            category: "developer",
            developerOnly: true,
            usage: "command <command name> <enable/disable>"
        });
        this.run = async (client, message, args, prefix) => {
            if (!args[0])
                return client.createArgumentError(message, { title: "Command Manager", description: "You have to provide a command to enable/disable!" }, this.usage);
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
            if (!command)
                return client.createArgumentError(message, { title: "Command Manager", description: `Cannot find the command \`${args[0]}\`!` }, this.usage);
            if (!args[1] || (args[1].toLowerCase() != "enable" && args[1].toLowerCase() != "disable"))
                return client.createArgumentError(message, { title: "Command Manager", description: "You have to specifiy, if you want to enable or disable this command!" }, this.usage);
            if (args[1].toLowerCase() == "enable" && !client.disabledCommands.has(command.name))
                return client.createArgumentError(message, { title: "Command Manager", description: "This command is already enabled!" }, this.usage);
            if (args[1].toLowerCase() == "disable" && client.disabledCommands.has(command.name))
                return client.createArgumentError(message, { title: "Command Manager", description: "This command is already disabled!" }, this.usage);
            if (args[1].toLowerCase() == "enable")
                client.disabledCommands.delete(command.name);
            if (args[1].toLowerCase() == "disable")
                client.disabledCommands.set(command.name, command);
            return client.createSuccess(message, { title: "Command Manager", description: `${args[1].toLowerCase() == "enable" ? "Enabled" : "Disabled"} the command \`${command.name}\`!` });
        };
    }
    ;
}
exports.default = EnableCommand;
;
//# sourceMappingURL=command.js.map