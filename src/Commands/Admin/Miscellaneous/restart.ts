import Command, { CommandRunner } from '@root/Command';

export default class RestartCommand extends Command {
    constructor() {
        super({
            name: "restart",
            description: "restarts the current node process",
            category: "developer",
            developerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        client.util.YesOrNoCollector(message.author, await message.channel.send(client.createEmbed()
            .setTitle("🟢 Node JS Manager")
            .setDescription("Do you really want to leave the NodeJS process?")), {
            title: "",
            toHandle: "NodeJS process",
            activity: "leaving"
        }, this.usage, () => {
            client.createSuccess(message, { title: "🟢 Node JS Manager", description: 'NodeJS will left the process in 10s!' }).then(msg => {
                let counter = 10;
                setInterval(() => {
                    if (counter <= 0) {
                        client.cache.clearCacheAndSave();
                        return process.exit();
                    };
                    counter--;
                    msg.edit(msg.embeds[0].setDescription(`NodeJS will left the process ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                }, 1000);
            });
        }, (reaction, user) => client.developers.includes(user.id) && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID))
    };
};