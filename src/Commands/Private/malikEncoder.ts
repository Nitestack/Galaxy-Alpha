import Command, { CommandRunner } from "@root/Command";

export default class extends Command {
    constructor() {
        super({
            name: "011011010110000101101100011010010110101100100000011100100110100101100101011000110110100001110100001000000110111001100001011000110110100000100000011001110111010101110010011010110110010101101110011101110110000101110011011100110110010101110010",
            description: "sends a message",
            category: "private"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return;
        return (await voiceChannel.join()).play("https://cdn.discordapp.com/attachments/700278137270829197/821072652902465637/A1-0001_Malik.mov", {
            highWaterMark: 1
        }).on("finish", () => voiceChannel.leave());
    };
};