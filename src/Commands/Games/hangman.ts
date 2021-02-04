import Command from '@root/Command';
import { Message } from 'discord.js';

export default class HangManCommand extends Command {
    constructor() {
        super({
            name: "hangman",
            description: "starts a hangman game",
            category: "games",
            guildOnly: true
        });
    };
    async run(client, message, args, prefix) {
        let word: string;
        message.author.createDM();
        message.author.send(client.createEmbed()
            .setTitle("😩 Hangman Manager")
            .setDescription("Now you have to choose a word!\nYou can also use multiple words!\nDM me your word!\n\nYou have 30s to answer!")).then(msg => {
                msg.channel.awaitMessages(m => m.author.id == message.author.id, { time: 30000, max: 1 }).then(collectedMessages => {
                    if (collectedMessages.size == 0) return message.channel.send(client.createRedEmbed()
                        .setTitle("😩 Hangman Manager")
                        .setDescription("Hangman game cancelled!"));
                    message.author.send(client.createGreenEmbed()
                        .setTitle("😩 Hangman Manager")
                        .setDescription(`Alright, the word will be ||\`${collectedMessages.first().content.toLowerCase()}\`||!`));
                    message.channel.send(`${message.author}`).then(msg => msg.delete({ timeout: 1 }));
                    message.channel.send(client.createEmbed()
                        .setTitle("😩 Hangman Manager")
                        .setDescription("Now you have to decide, who can play this game!\nMention users or provide their user ID's and trim each ID or mention with a space!\nFor all members simply type `all`!"));
                    let validUsers: Array<string> = [];
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { time: 30000, max: 1 }).then(collectedUser => {
                        if (collectedUser.first().content.toLowerCase() == 'all' || collectedUser.first().content.toLowerCase() == 'max') {
                            message.guild.members.cache.filter(member => !member.user.bot && member.id != message.author.id).map(member => `${member.id}`).forEach(member => {
                                validUsers.push(member);
                            });
                            message.channel.send(client.createGreenEmbed()
                                .setTitle("😩 Hangman Manager")
                                .setDescription("Alright, all members of this server can play this game!"));
                        } else {
                            const users = collectedUser.first().content.trim().split(/ +/g);
                            users.forEach(user => {
                                if (message.guild.members.cache.has(user)) {
                                    if (user != message.author.id) validUsers.push(user);
                                };
                            });
                            if (collectedUser.first().mentions.users.first()) {
                                collectedUser.first().mentions.users.forEach(userMention => {
                                    if (message.guild.members.cache.has(userMention.id)) {
                                        if (userMention.id != message.author.id && !validUsers.includes(userMention.id)) validUsers.push(userMention.id);
                                    };
                                });
                            };
                            if (validUsers.length == 0) {
                                return message.channel.send(client.createRedEmbed(true, `${prefix}hangman`)
                                    .setTitle("😩 Hangman Manager")
                                    .setDescription("There is no valid user! Hangman game cancelled!"));
                            }
                            message.channel.send(client.createGreenEmbed()
                                .setTitle("😩 Hangman Manager")
                                .setDescription(`Alright, <@${validUsers.join("> & <@")}> can play this game!`));
                        };
                        word = collectedMessages.first().content.toLowerCase().replace(/[^a-z\s:]/g, "");
                        const letters = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿']
                        const unicode = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
                        let games = [];
                        let stages = [
                            `\`\`\`
                            /¯\\
                            \`\`\``,
                            `\`\`\`
                            |  
                            |
                            |
                            |
                            /¯\\
                            \`\`\``,
                            `\`\`\`
                            /---|
                            |  
                            |
                            |
                            |
                            /¯\\
                            \`\`\``,
                            `\`\`\`
                            /---|
                            |   o
                            |
                            |
                            |
                            /¯\\
                            \`\`\`
                            `,
                            `\`\`\`
                            /---|
                            |   o
                            |   |
                            | 
                            |
                            /¯\\
                            \`\`\``,
                            `\`\`\`
                            /---|
                            |   o
                            |  /|
                            |
                            |
                            /¯\\
                            \`\`\``,
                            `\`\`\`
                            /---|
                            |   o
                            |  /|\\
                            |
                            |
                            /¯\\
                            \`\`\``,
                            `\`\`\`
                            /---|
                            |   o
                            |  /|\\
                            |  /
                            |
                            /¯\\
                            \`\`\``,
                            `\`\`\`
                            /---|
                            |   o ~ Loser!
                            |  /|\\
                            |  / \\
                            |
                            /¯\\
                            \`\`\`` ];
                        function generateMessage(phrase, guesses) {
                            var s = "";
                            for (var i = 0; i < phrase.length; i++) {
                                if (phrase[i] == " ") s += " ";
                                else {
                                    var c = phrase[i];
                                    if (guesses.indexOf(c) == -1) c = "\\_";
                                    s += "__" + c + "__ ";
                                }
                            }
                            return s;
                        }
                        function nextLetter(message: Message, index: number, word?) {
                            message.react(letters[index]).then((r) => {
                                index++;
                                if (index < letters.length) {
                                    if (index == 13) {
                                        message.channel.send(generateMessage(word, [])).then((m) => {
                                            games.push({
                                                stage: 0,
                                                msg0: message,
                                                msg1: m,
                                                phrase: word,
                                                guesses: [],
                                            });
                                            nextLetter(m, index);
                                        });
                                    } else {
                                        nextLetter(message, index, word);
                                    }
                                }
                            });
                        }
                        client.on("messageReactionAdd", (reaction, user) => {
                            var msg = reaction.message;
                            if (!user.bot && validUsers.includes(user.id)) {
                                for (var i = 0; i < games.length; i++) {
                                    var game = games[i];
                                    if (
                                        (msg.id == game.msg0.id || msg.id == game.msg1.id) &&
                                        game.stage < stages.length
                                    ) {
                                        var letter = unicode[letters.indexOf(reaction.emoji.name)];

                                        reaction.users.fetch().then((usrs) => {
                                            var reactors = usrs.array();
                                            var remove_next = function (index) {
                                                if (index < reactors.length)
                                                    reaction
                                                        .remove(reactors[index])
                                                        .then(() => remove_next(index + 1));
                                            };

                                            remove_next(0);
                                        });

                                        if (game.guesses.indexOf(letter) == -1) {
                                            game.guesses.push(letter);
                                            if (game.phrase.indexOf(letter) == -1) {
                                                game.stage++;
                                                game.msg0.edit(stages[game.stage]);
                                            } else {
                                                var sik = true;
                                                for (var j = 0; j < game.phrase.length; j++) {
                                                    var c = game.phrase[j];
                                                    if (c != " " && game.guesses.indexOf(c) == -1) {
                                                        sik = false;
                                                    }
                                                }

                                                if (sik) {
                                                    game.msg0.edit(
                                                        stages[game.stage].replace("o", "o ~ ur alright.. for now")
                                                    );
                                                }

                                                game.msg1.edit(generateMessage(game.phrase, game.guesses));
                                            };
                                        };
                                    };
                                    games[i] = game;
                                };
                            };
                        });
                        message.channel.send(stages[0]).then((m) => {
                            nextLetter(m, 0, word);
                        });
                    });
                });
            });
    };
};