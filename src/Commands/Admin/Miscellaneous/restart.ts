import Command, { CommandRunner } from '@root/Command';

export default class RestartCommand extends Command {
    constructor() {
        super({
            name: "restart",
            description: "restarts the current node process",
            category: "developer",
            ownerOnly: true
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        return message.channel.send(client.createEmbed()
            .setTitle("🟢 Node JS Manager")
            .setDescription("Do you really want to leave the NodeJS process?")).then(async msg => {
                await msg.react(client.yesEmojiID);
                await msg.react(client.noEmojiID);
                const YesOrNo = msg.createReactionCollector((reaction, user) => client.developers.includes(user.id) && (reaction.emoji.id == client.yesEmojiID || reaction.emoji.id == client.noEmojiID), { max: 1 });
                YesOrNo.on("collect", (reaction, user) => {
                    if (reaction.emoji.id == client.yesEmojiID) {
                        let embed = client.createEmbed().setTitle('🟢 Node JS Manager').setDescription('NodeJS will left the process in 10s!');
                        return message.channel.send(embed).then(msg => {
                            let counter = 10;
                            setInterval(() => {
                                if (counter <= 0) {
                                    msg.delete();
                                    return process.exit();
                                }
                                counter--;
                                msg.edit(embed.setDescription(`NodeJS will left the process ${counter == 0 ? 'now' : `in ${counter}s`}!`));
                            }, 1000);
                        });
                    } else return message.channel.send(client.createRedEmbed()
                        .setTitle("🟢 Node JS Manager")
                        .setDescription("Leaving NodeJS process cancelled!"));
                });
            });
    };
};