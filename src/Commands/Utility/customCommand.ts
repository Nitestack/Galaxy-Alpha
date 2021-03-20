import Command, { CommandRunner } from "@root/Command";

export default class extends Command {
    constructor() {
        super({
            name: "customcommand",
            description: "the custom command manager",
            category: "utility",
            userPermissions: ["MANAGE_GUILD"],
            requiredRoles: ["serverManagerRoleID"],
            aliases: ["cc"],
            guildOnly: true
        });
    };
    run: CommandRunner = async (client, message, args: Array<string>, prefix) => {
        const customCommandManager = "📟 Custom Command Manager";
        if (args[0]?.toLowerCase() == "create") {
            const prompts = [
                "Please provide a command name!",
                "Are there any aliases? If yes, please trim each alias with an `|`! If no, please type `none`!",
                "What is the answer to this command? If you want multiple answers, please trim each answer with an `|`!"
            ];
            const responses: {
                name: string,
                aliases: Array<string>,
                answers: Array<string>
            } = {
                name: null,
                aliases: null,
                answers: null
            };
            for (let i = 0; i < prompts.length; i++) {
                await message.channel.send(client.createEmbed()
                    .setTitle("📟 Custom Command")
                    .setDescription(prompts[i])
                    .addField("How to cancel?", "Simply type `cancel` to cancel the process!"));
                const msg = (await message.channel.awaitMessages((msg) => msg.author.id == message.author.id, { max: 1, time: 30000 })).first();
                if (!msg || msg.content.toLowerCase() == "cancel") return client.createArgumentError(message, { title: customCommandManager, description: "Cancelled creating custom command!" }, `${this.name} create`);
                if (i == 0) {
                    responses.name = msg.content;
                } else if (i == 1) {
                    if (msg.content.toLowerCase() == "none") responses.aliases = [];
                    responses.aliases = msg.content.trim().split(/\|/g).map(alias => `${alias.trim()}`);
                } else {
                    if (!msg.content.includes("|")) responses.answers = [msg.content];
                    responses.answers = msg.content.trim().split(/\|/g);
                };
                client.cache.customCommands.set(`${message.guild.id}-${responses.name}`, {
                    aliases: responses.aliases,
                    allowedChannels: [],
                    allowedMembers: [],
                    allowedRoles: [],
                    answers: responses.answers,
                    guildID: message.guild.id,
                    name: responses.name,
                    notAllowedChannels: [],
                    notAllowedMembers: [],
                    notAllowedRoles: []
                });
            };
            return client.createSuccess(message, { title: customCommandManager, description: "Successfully created custom command!" });
        } else if (args[0]?.toLowerCase() == "delete") {
            if (!args[1]) return client.createArgumentError(message, { title: customCommandManager, description: "You have to provide an command name or alias to delete!" }, `${this.name} delete <command name / command alias>`);
            const command = await client.cache.getCustomCommand(message.guild.id, args[1].toLowerCase());
            if (!command) return client.createArgumentError(message, { title: customCommandManager, description: `Cannot find the command \`${args[1].toLowerCase()}\`!`}, `${this.name} delete <command name / command alias>`);
            client.cache.customCommands.delete(`${message.guild.id}-${command.name}`);
            return client.createSuccess(message, { title: customCommandManager, description: "Successfully deleted command!" });
        } else return client.createEmbedForSubCommands(message, {
            title: "📟 Custom Command",
            description: "Custom Command Manager to create and delete custom commands!"
        }, [{
            description: "Deletes a custom command",
            usage: `${this.name} delete <command name / command alias>`
        }, {
            description: "Creates a custom command",
            usage: `${this.name} create`
        }]);
    };
};