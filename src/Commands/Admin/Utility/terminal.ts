import Command, { CommandRunner } from "@root/Command";
import child from "child_process";

export default class TerminalCommand extends Command {
    constructor(){
        super({
            name: "terminal",
            description: "emites a terminal",
            developerOnly: true,
            category: "developer",
            args: [{
                type: "text",
                required: true,
                errorTitle: "Terminal Manager",
                errorMessage: "You have to provide a command to execute on the terminal!"
            }]
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const command = args[0];
        child.exec(command, (err, res) => {
            if (err) {
                if (err.message?.length < 2048) return client.createArgumentError(message, { title: "ERROR", description: `${err}`}, this.usage);
                else {
                    client.createArgumentError(message, { title: "ERROR", description: `**Name**: ${err.name}\n**Code:** ${err.code}\n**Killed**: ${err.killed}\n**Signal**: ${err.signal}`}, this.usage);
                    return console.log(err);
                };
            };
            if (res.length < 2048) {
                return message.channel.send(client.createEmbed()
                    .setTitle("Terminal")
                    .setDescription(`\`\`\`js\n${res}\`\`\``));
            } else {
                client.createSuccess(message, { title: "Terminal", description: "The message is too long, results are in the console!"});
                return console.log(err);
            };
        });
    };
};