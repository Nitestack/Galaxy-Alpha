import Command, { CommandRunner } from '@root/Command';

export default class EmojifyCommand extends Command {
    constructor(){
        super({
            name: "emojify",
            description: "converts an user's name into emojis",
            category: "miscellaneous",
            usage: "emojify [@User/User ID]"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        let text: string = message.author.username;
        if (message.mentions.users.first() && client.users.cache.has(message.mentions.users.first().id)) text = message.mentions.users.first().username;
        else if (args[0] && client.users.cache.has(args[0])) text = client.users.cache.get(args[0]).username;
        else if (args[0]) text = args.join(" ");

        const specialCodes = {
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            '9': ':nine:',
            '#': ':hash:',
            '*': ':asterisk:',
            '?': ':grey_question:',
            '!': ':grey_exclamation:',
            ' ': '   '
          }
        text = text.toLowerCase().split('').map(letter => {
            if(/[a-z]/g.test(letter)) return `:regional_indicator_${letter}:`;
            else if (specialCodes[letter]) return `${specialCodes[letter]}`;
            return letter;
        }).join('');
        return message.channel.send(text);
    };
};