"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//MODULES\\
const fs_1 = require("fs");
const path_1 = require("path");
const ms_1 = __importDefault(require("ms"));
const discord_js_1 = require("discord.js");
const mongoose_1 = require("mongoose");
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const ascii_table_1 = __importDefault(require("ascii-table"));
const SlashCommand_1 = __importDefault(require("@root/SlashCommand"));
//MANAGER\\
const Giveaway_1 = __importDefault(require("@commands/Giveaway/Giveaway"));
const Ticket_1 = __importDefault(require("@commands/Utility/Ticket/Ticket"));
const Drop_1 = __importDefault(require("@commands/Giveaway/Drop"));
const GlobalCache_1 = __importDefault(require("@root/GlobalCache"));
const Music_1 = __importDefault(require("@commands/Music/Music"));
const Util_1 = __importDefault(require("@root/Util"));
//MODELS\\
const giveaways_1 = __importDefault(require("@models/Giveaways/giveaways"));
const drops_1 = __importDefault(require("@models/Giveaways/drops"));
const ticket_1 = __importDefault(require("@models/ticket"));
const guild_1 = __importDefault(require("@models/guild"));
const level_1 = __importDefault(require("@models/level"));
//ANY THING ELSE\\
const Drop_2 = require("@commands/Giveaway/Drop");
//TABLES\\
const clientInfoTable = new ascii_table_1.default("Client Info");
;
class GalaxyAlpha extends discord_js_1.Client {
    /**
     * @param {GalaxyAlphaOptions} options The options of Galaxy Alpha
     */
    constructor(config) {
        super({
            ws: {
                intents: discord_js_1.Intents.ALL
            },
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
            disableMentions: "everyone",
            shards: "auto",
            shardCount: 1,
            retryLimit: 0
        });
        this.config = config;
        //MANAGERS\\
        this.giveaways = new Giveaway_1.default(this);
        this.tickets = new Ticket_1.default(this);
        this.drop = new Drop_1.default(this);
        this.music = new Music_1.default(this);
        this.cache = new GlobalCache_1.default(this);
        this.util = new Util_1.default(this);
        //CONFIGURATION\\
        this.secret = "";
        this.ownerID = this.config.ownerID;
        this.globalPrefix = this.config.globalPrefix;
        this.developers = this.config.developers || [this.ownerID];
        this.contributors = this.config.contributors || [];
        this.supportGuildID = this.config.supportGuildID || null;
        this.defaultColor = this.config.defaultEmbedColor || this.util.embedColorHex;
        this.ignoreFiles = this.config.ignoreFiles || [];
        this.xpPerMessage = this.config.xpPerMessage || 20;
        //MODULES\\
        this.ms = ms_1.default;
        this.humanizer = humanize_duration_1.default;
        //INFOS\\
        this.dataSchemaObjectId = "5ffb5b87ef40ba40a0842eb5";
        this.inviteLink = "";
        //COLLECTIONS\\
        this.commands = new discord_js_1.Collection();
        this.disabledCommands = new discord_js_1.Collection();
        this.slashCommands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.aliases = new discord_js_1.Collection();
        this.cooldowns = new discord_js_1.Collection();
        this.features = new discord_js_1.Collection();
        this.snipes = new discord_js_1.Collection();
        this.modMails = new discord_js_1.Collection();
        this.categories = new discord_js_1.Collection();
        this.ghostPings = new discord_js_1.Collection();
        this.queue = new discord_js_1.Collection();
        this.afks = new discord_js_1.Collection();
        this.inGame = new discord_js_1.Collection();
        //VOTE LINKS\\
        this.topGGBot = "https://top.gg/bot/761590139147124810/vote";
        this.topGGServer = "https://top.gg/servers/783440776285651024/vote";
        this.discordBotList = "https://discordbotlist.com/bots/galaxy-alpha/upvote";
        this.discordServerList = "https://discordbotlist.com/servers/galaxy-alpha/upvote";
        //EMOJIS\\
        this.warningInfoEmoji = "<a:warning_info:786706519071916032>";
        this.developerToolsEmoji = "<:tools_dev:786332338207457340>";
        this.infoEmoji = "<:info:786676407362781195>";
        this.chatEmoji = "<a:chat:786707292870803506>";
        this.memberEmoji = "<:members:786705341484236800>";
        this.workingGearEmoji = "<a:working_gear:786707189468495882>";
        this.yesEmoji = "<a:yes:786708571664154644>";
        this.noEmoji = "<a:no:786708723976503326>";
        this.arrowEmoji = "<a:arrow:786706422317580318>";
        this.profileEmoji = "<:galaxy_alpha:792083061666873345>";
        this.desktopEmoji = "<:desktop_dev:786332949226323988>";
        this.galaxyAlphaEmoji = "<:galaxy_alpha:792083061666873345>";
        this.protectedEmoji = "<a:protected:786707379470598174>";
        //EMOJI ID'S\\
        this.warningInfoEmojiID = this.getEmojiID(this.warningInfoEmoji);
        this.developerToolsEmojiID = this.getEmojiID(this.developerToolsEmoji);
        this.infoEmojiID = this.getEmojiID(this.infoEmoji);
        this.chatEmojiID = this.getEmojiID(this.chatEmoji);
        this.memberEmojiID = this.getEmojiID(this.memberEmoji);
        this.workingGearEmojiID = this.getEmojiID(this.workingGearEmoji);
        this.yesEmojiID = this.getEmojiID(this.yesEmoji);
        this.noEmojiID = this.getEmojiID(this.noEmoji);
        this.arrowEmojiID = this.getEmojiID(this.arrowEmoji);
        this.profileEmojiID = this.getEmojiID(this.profileEmoji);
        this.desktopEmojiID = this.getEmojiID(this.desktopEmoji);
        this.galaxyAlphaEmojiID = this.getEmojiID(this.galaxyAlphaEmoji);
        this.protectedEmojiID = this.getEmojiID(this.protectedEmoji);
        if (!this.config.ownerID)
            throw new Error("A bot owner has to be provided!");
        if (!this.config.globalPrefix)
            throw new Error("A global prefix has to be provided!");
        if (!this.config.token)
            throw new Error("A token has to be provided!");
        if (!this.config.commandsDir)
            throw new Error("The command directory has to be provided!");
        if (!this.config.eventsDir)
            throw new Error("The event directory has to be provided!");
        if (!this.config.eventsDir)
            throw new Error("The feature directory has to be provided!");
        if (!this.config.mongoDBUrl)
            throw new Error("The MongoDB url has to be provided!");
        this.start();
    }
    ;
    //METHODS\\
    async start() {
        //LOGIN\\
        this.login(this.config.token);
        process.on('unhandledRejection', (reason, promise) => {
            console.log('Unhandled Rejection at:', promise, 'reason:', reason);
        });
        //READ COMMANDS, EVENTS, FEATURES, SLASH COMMANDS\\
        const commands = await this.readCommands(this.config.commandsDir);
        const events = await this.readEvents(this.config.eventsDir);
        const features = await this.readFeatures(this.config.featuresDir);
        const slashCommands = await this.readSlashCommands(this.config.slashCommandsDir);
        clientInfoTable.addRow("Commands", commands);
        clientInfoTable.addRow("Events", events);
        clientInfoTable.addRow("Features", features);
        clientInfoTable.addRow("Slash Commands", slashCommands);
        //MONGO DB\\
        await this.connectToMongoDB(this.config.mongoDBUrl, {
            ...this.config.mongoDBConnectionOptions,
            dbName: "data"
        });
        this.mongoDBConnection = mongoose_1.connection;
        //READY EVENT\\
        this.once("ready", async () => {
            this.inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${this.user.id}&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&scope=applications.commands%20bot`;
            //GUILD\\
            if (this.config.supportGuildID)
                this.supportGuild = this.guilds.cache.get(this.supportGuildID);
            //SLASH COMMANDS\\
            const commands = await this.getApp("783440776285651024").commands.get();
            this.slashCommands.forEach(async (slashCommand) => {
                const command = commands.find(command => command.name.toLowerCase() == slashCommand.name.toLowerCase());
                if (command)
                    await SlashCommand_1.default.editSlashCommand(command.id, slashCommand, "783440776285651024");
                else
                    await SlashCommand_1.default.createSlashCommand(slashCommand, "783440776285651024");
            });
            //CLIENT INFO\\
            clientInfoTable.addRow('Created At', this.util.dateFormatter(this.user.createdAt));
            clientInfoTable.addRow('Presence Status', this.user.presence.status);
            clientInfoTable.addRow('Uptime', this.ms(this.uptime));
            clientInfoTable.addRow('WS Status', this.ws.status);
            clientInfoTable.addRow('API Ping', this.ms(this.ws.ping));
            clientInfoTable.addRow('API Gateway', this.ws.gateway);
            clientInfoTable.addRow('Servers', this.guilds.cache.size);
            clientInfoTable.addRow('Members', this.users.cache.size);
            clientInfoTable.addRow('Channels', this.channels.cache.size);
            clientInfoTable.addRow('Client Status', '✅ Online!');
            clientInfoTable.addRow('Author', 'HydraNhani#8303');
            //TABLES\\
            console.log(clientInfoTable.toString());
            //FEATURE HANDLER\\
            this.features.forEach(feature => feature.run(this));
            //DATABASE FILTER\\
            this.DBfilter(this.user.id == "761590139147124810" ? true : false);
            this.secret = this.user.id == "761590139147124810" ? process.env.CLIENT_SECRET : process.env.CLIENT_BETA_SECRET;
            await Promise.resolve().then(() => __importStar(require("@dashboard/server")));
            //ACTIVITY\\
            const activityArray = [
                `${this.globalPrefix}help | Support Server: gg/qvbFn6bXQX`,
                `${this.guilds.cache.size.toLocaleString()} servers | Support Server: gg/qvbFn6bXQX`,
                `${this.users.cache.size.toLocaleString()} users | Support Server: gg/qvbFn6bXQX`,
                `${this.channels.cache.size.toLocaleString()} channels | Support Server: gg/qvbFn6bXQX`,
                `${this.users.cache.get(this.ownerID).tag} | Support Server: gg/qvbFn6bXQX`
            ];
            const typeArray = [
                "PLAYING",
                "WATCHING",
                "LISTENING"
            ];
            let index = 0;
            let typeIndex = 0;
            setInterval(() => {
                if (activityArray.length == index)
                    index = 0;
                if (typeArray.length == typeIndex)
                    typeIndex = 0;
                this.user.setPresence({
                    activity: {
                        name: activityArray[index],
                        type: typeArray[typeIndex]
                    },
                    status: "online"
                });
                index++;
                typeIndex++;
            }, 10000);
            setInterval(async () => await this.cache.clearCacheAndSave(), 3600000);
        });
    }
    ;
    /**
     * Reads all commands of the provided directory
     * @param {string} commandPath The command directory
     */
    async readCommands(commandPath) {
        let i = 0;
        for (const file of fs_1.readdirSync(path_1.join(__dirname, commandPath))) {
            if (fs_1.lstatSync(path_1.join(__dirname, commandPath, file)).isDirectory())
                this.readCommands(path_1.join(commandPath, file));
            else if (!this.ignoreFiles.includes(file)) {
                if (!file.endsWith(".ts")) {
                    clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
                    continue;
                }
                ;
                const { default: Command } = await Promise.resolve().then(() => __importStar(require(path_1.join(__dirname, commandPath, file))));
                if (typeof Command == "undefined")
                    clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", `NO constructor - ${path_1.join(__dirname, commandPath, file)}`);
                const command = new Command();
                if (!command.name) {
                    clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "Name left!");
                    continue;
                }
                else if (!command.description) {
                    clientInfoTable.addRow(`${command.name}`, "❌", "Description left!");
                    continue;
                }
                else if (!command.category) {
                    clientInfoTable.addRow(`${command.name}`, "❌", "Category left!");
                    continue;
                }
                else {
                    if (this.commands.some(cmd => cmd.name == command.name || cmd.aliases?.includes(command.name))) {
                        clientInfoTable.addRow(`${command.name}`, "❌", "Name already existing!");
                        continue;
                    }
                    ;
                    for (const alias of command.aliases ? command.aliases : [])
                        if (this.commands.some(cmd => cmd.name == alias || cmd.aliases?.includes(alias))) {
                            clientInfoTable.addRow(`${command.name}`, "❌", "Alias already existing!");
                            continue;
                        }
                    ;
                    this.commands.set(command.name.toLowerCase(), command);
                    i++;
                    if (!this.categories.has(command.category))
                        this.categories.set(command.category, []);
                    this.categories.get(command.category).push(command);
                    if (command.aliases)
                        command.aliases.map(alias => this.aliases.set(alias.toLowerCase(), command.name));
                }
                ;
            }
            ;
        }
        ;
        return i;
    }
    ;
    /**
     * Reads all events of the provided directory
     * @param {string} eventPath The event directory
     */
    async readEvents(eventPath) {
        let i = 0;
        for (const file of fs_1.readdirSync(path_1.join(__dirname, eventPath))) {
            if (fs_1.lstatSync(path_1.join(__dirname, eventPath, file)).isDirectory())
                this.readEvents(path_1.join(eventPath, file));
            else if (!this.ignoreFiles.includes(file)) {
                if (!file.endsWith(".ts")) {
                    clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
                    continue;
                }
                ;
                const { default: Event } = await Promise.resolve().then(() => __importStar(require(path_1.join(__dirname, eventPath, file))));
                const event = new Event();
                if (!event.name) {
                    clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "Name left!");
                    continue;
                }
                else {
                    this.on(event.name, event.run.bind(null, this));
                    this.events.set(event.name, event);
                    i++;
                }
                ;
            }
            ;
        }
        ;
        return i;
    }
    ;
    /**
     * Reads all features of the provided directory
     * @param {string} featurePath The feature directory
     */
    async readFeatures(featurePath) {
        let i = 0;
        for (const file of fs_1.readdirSync(path_1.join(__dirname, featurePath))) {
            if (fs_1.lstatSync(path_1.join(__dirname, featurePath, file)).isDirectory())
                this.readFeatures(path_1.join(featurePath, file));
            else if (!this.ignoreFiles.includes(file)) {
                if (!file.endsWith(".ts")) {
                    clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
                    continue;
                }
                ;
                const { default: Feature } = await Promise.resolve().then(() => __importStar(require(path_1.join(__dirname, featurePath, file))));
                const feature = new Feature();
                if (!feature.name) {
                    clientInfoTable.addRow(`${feature.name}`, "❌", "Name left!");
                    continue;
                }
                else {
                    this.features.set(feature.name, feature);
                    i++;
                }
                ;
            }
            ;
        }
        ;
        return i;
    }
    ;
    /**
     * Reads all slash commands of the provided directory
     * @param {string} slashCommandPath The slash command directory
     */
    async readSlashCommands(slashCommandPath) {
        let i = 0;
        for (const file of fs_1.readdirSync(path_1.join(__dirname, slashCommandPath))) {
            if (fs_1.lstatSync(path_1.join(__dirname, slashCommandPath, file)).isDirectory())
                this.readSlashCommands(path_1.join(slashCommandPath, file));
            else if (!this.ignoreFiles.includes(file)) {
                if (!file.endsWith(".ts")) {
                    clientInfoTable.addRow(`${file.split(".")[0]}`, "❌", "NO Typescript file");
                    continue;
                }
                ;
                const { default: SlashCommand } = await Promise.resolve().then(() => __importStar(require(path_1.join(__dirname, slashCommandPath, file))));
                const slashCommand = new SlashCommand();
                this.slashCommands.set(slashCommand.name, slashCommand);
                i++;
            }
            ;
        }
        ;
        return i;
    }
    ;
    /**
     * Creates an error and sends it to the channel
     * @param {Message} message The created message
     * @param {object} embed The embed object
     * @param {string} usage The command usage
     */
    async createArgumentError(message, embed, usage) {
        return message.channel.send(this.createRedEmbed(true, `${message.guild ? (await this.cache.getGuild(message.guild.id)).prefix : this.globalPrefix}${usage}`)
            .setTitle(embed.title)
            .setDescription(embed.description));
    }
    ;
    /**
     * Creates a success message and sends it to the channel
     * @param {Message} message The created message
     * @param {object} embed The embed object
     * @param {string} usage The command usage
     */
    async createSuccess(message, embed, usage) {
        return message.channel.send(this.createGreenEmbed(usage ? true : false, usage ? `${message.guild ? (await this.cache.getGuild(message.guild.id)).prefix : this.globalPrefix}${usage}` : null)
            .setTitle(embed.title)
            .setDescription(embed.description));
    }
    ;
    /**
     * Creates a help table for sub commands and sends it to the channel
     * @param {Message} message The created message
     * @param {object} embed The embed object
     * @param {Array<object>} commands The sub commands
     */
    async createEmbedForSubCommands(message, embed, commands) {
        const EMBED = this.createEmbed().setTitle(embed.title);
        const prefix = message.guild ? (await this.cache.getGuild(message.guild.id)).prefix : this.globalPrefix;
        for (const command of commands)
            EMBED.addField(this.util.toUpperCaseBeginning(command.description), `\`${prefix}${command.usage}\``);
        if (embed.description)
            EMBED.setDescription(embed.description);
        return message.channel.send(EMBED);
    }
    ;
    /**
     * Creates an embed with the default embed color
     * @param {boolean} usageField If it is true, it adds a usage field
     * @param {string} usage The command usage
     */
    createEmbed(usageField, usage) {
        if (usageField) {
            return new discord_js_1.MessageEmbed({
                color: this.defaultColor,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                },
                fields: [{
                        name: '🤔 Usage:',
                        value: `${this.arrowEmoji} \`${usage}\``
                    }],
            }).setTimestamp();
        }
        else {
            return new discord_js_1.MessageEmbed({
                color: this.defaultColor,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                }
            }).setTimestamp();
        }
        ;
    }
    ;
    /**
     * Creates an embed with green embed color
     * @param {boolean} usageField If it is true, it adds a usage field
     * @param {string} usage The command usage
     */
    createGreenEmbed(usageField, usage) {
        if (usageField) {
            return new discord_js_1.MessageEmbed({
                color: this.util.greenColorHex,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                },
                fields: [{
                        name: '🤔 Usage:',
                        value: `${this.arrowEmoji} \`${usage}\``
                    }],
            }).setTimestamp();
        }
        else {
            return new discord_js_1.MessageEmbed({
                color: this.util.greenColorHex,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                }
            }).setTimestamp();
        }
        ;
    }
    ;
    /**
     * Creates an embed with yellow embed color
     * @param {boolean} usageField If it is true, it adds a usage field
     * @param {string} usage The command usage
     */
    createYellowEmbed(usageField, usage) {
        if (usageField) {
            return new discord_js_1.MessageEmbed({
                color: this.util.yellowColorHex,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                },
                fields: [{
                        name: '🤔 Usage:',
                        value: `${this.arrowEmoji} \`${usage}\``
                    }],
            }).setTimestamp();
        }
        else {
            return new discord_js_1.MessageEmbed({
                color: this.util.yellowColorHex,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                }
            }).setTimestamp();
        }
        ;
    }
    ;
    /**
     * Creates an embed with red embed color
     * @param {boolean} usageField If it is true, it adds a usage field
     * @param {string} usage The command usage
     */
    createRedEmbed(usageField, usage) {
        if (usageField) {
            return new discord_js_1.MessageEmbed({
                color: this.util.redColorHex,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true }),
                },
                fields: [{
                        name: '🤔 Usage:',
                        value: `${this.arrowEmoji} \`${usage}\``
                    }]
            }).setTimestamp();
        }
        else {
            return new discord_js_1.MessageEmbed({
                color: this.util.redColorHex,
                footer: {
                    text: "Created By HydraNhani",
                    iconURL: this.user.displayAvatarURL({ dynamic: true })
                }
            }).setTimestamp();
        }
        ;
    }
    ;
    //GET EMOJI ID\\
    /**
     * Gets the emoji ID from the "unicode" of the custom emoji
     * @param {string} emoji The emoji
     */
    getEmojiID(emoji) {
        return emoji.split(":")[2].split(">")[0];
    }
    ;
    //AUTO FILTER DATABASE\\
    /**
     * Filters the database after every start
     * @param {boolean} enable If it is enabled, this automatically filters the database to clear storage
     */
    async DBfilter(enable = false) {
        if (!enable)
            return;
        //GIVEAWAYS\\
        const giveaways = await giveaways_1.default.find({});
        for (const giveaway of giveaways)
            this.giveaways.endGiveaway(giveaway.messageID);
        //DROPS\\
        const drops = await drops_1.default.find({});
        for (const drop of drops)
            Drop_2.deleteDrop(drop.messageID);
        //TICKETS\\
        const tickets = await ticket_1.default.find({});
        for (const ticket of tickets) {
            const check = this.channels.cache.filter(channel => channel.type == 'news' || channel.type == 'text').get(ticket.channelID);
            if (!check)
                await ticket_1.default.findOneAndDelete({
                    channelID: ticket.channelID
                });
        }
        ;
        //GUILDS\\
        const guilds = await guild_1.default.find({});
        for (const guild of guilds) {
            const check = this.guilds.cache.get(guild.guildID);
            if (!check)
                await guild_1.default.findOneAndDelete({
                    guildID: guild.guildID
                });
        }
        ;
        //MESSAGES AND LEVEL\\
        const levels = await level_1.default.find({});
        for (const level of levels) {
            const guildCheck = this.guilds.cache.get(level.guildID);
            if (guildCheck) {
                const memberCheck = guildCheck.members.cache.get(level.userID);
                if (!memberCheck)
                    await level_1.default.findOneAndDelete({
                        guildID: level.guildID,
                        userID: level.userID
                    });
            }
            else
                await guild_1.default.findOneAndDelete({
                    guildID: level.guildID
                });
        }
        ;
    }
    ;
    async modLogWebhook(guildID, embed) {
        const guildSettings = await this.cache.getGuild(guildID);
        if (guildSettings) {
            if (guildSettings.modLogChannelID && guildSettings.modLogChannelWebhookID && guildSettings.modLogChannelWebhookToken) {
                const channel = this.channels.cache.get(guildSettings.modLogChannelID);
                if (channel) {
                    const webhooks = await channel.fetchWebhooks();
                    if (webhooks.has(guildSettings.modLogChannelWebhookID)) {
                        const webhook = new discord_js_1.WebhookClient(guildSettings.modLogChannelWebhookID, guildSettings.modLogChannelWebhookToken, {
                            partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]
                        });
                        webhook.send(embed);
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    getApp(guildID) {
        //@ts-ignore
        const app = this.api.applications(this.user.id);
        if (guildID)
            app.guilds(guildID);
        return app;
    }
    ;
    async connectToMongoDB(url, options) {
        await mongoose_1.connect(url, {
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            ...options
        });
        mongoose_1.set('useNewUrlParser', true);
        mongoose_1.set('useFindAndModify', false);
        mongoose_1.set('useUnifiedTopology', true);
        return mongoose_1.connection;
    }
    ;
}
exports.default = GalaxyAlpha;
;
//# sourceMappingURL=Client.js.map