import Command, { CommandRunner } from "@root/Command";

export default class BirtdayCommand extends Command {
    constructor() {
        super({
            name: "birthday",
            description: "birthday commands",
            category: "utility",
            usage: "birthday set <mm/dd/yyyy> or birthday when"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        if (args[0]?.toLowerCase() == "set") {

        } else if (args[0]?.toLowerCase() == "when") {

        } else return client.createEmbedForSubCommands(message, {
            title: "🎉 Birthday",
            description: "Use this commands to see and set your birthday"
        }, [{
            description: "Set's the birthday",
            usage: `${this.name} set <mm/dd/yyyy>`
        }, {
            description: "Shows you when your birthday is",
            usage: `${this.name} when`
        }]);
    };
};