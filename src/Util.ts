import { Message, MessageReaction, NewsChannel, PermissionString, TextChannel, User, GuildMember } from "discord.js";
import GalaxyAlpha from "@root/Client";
import Command from "@root/Command";
import { URL } from "url";

export default class GalaxyAlphaUtil {
    constructor(private client: GalaxyAlpha){ };
    public permissionConverted(permission: PermissionString): string {
        if (permission == "USE_VAD") return "Use Voice Activity";
        if (permission == "CREATE_INSTANT_INVITE") return "Create Invite";
        if (permission == "MENTION_EVERYONE") return "Mention @everyone, @here, and All Roles";
        return permission.toLowerCase().replace(/guild/g, "server").split("_").map(permission => this.toUpperCaseBeginning(permission)).join(" ");
    };
    public weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    public monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public embedColorHex = "#2f3136";
    public greenColorHex = "#2ecc71";
    public yellowColorHex = "#f1c40f";
    public redColorHex = "#ff0000";
    public embedFormatter: EmbedFormatter = new EmbedFormatter();
    /**
     * Returns a number from the provided minimum to the provided maximum
     * @param {number} min The minimum number
     * @param {number} max The maximum number
     */
    public getRandomArbitrary(min: number, max: number) {
        return Math.random() * (max - min) + min;
    };
    /**
     * Formats a duration into a string value
     * @param {number} milliseconds The duration in milliseconds
     */
    public getDuration(milliseconds: number): string {
        if (!milliseconds || isNaN(milliseconds)) return "00:00";
        const seconds = Math.floor(milliseconds % 60000 / 1000);
        const minutes = Math.floor(milliseconds % 3600000 / 60000);
        const hours = Math.floor(milliseconds / 3600000);
        if (hours > 0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
        if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
        return `00:${formatInt(seconds)}`;
        function formatInt(int: number) {
            if (int < 10) return `0${int}`;
            return `${int}`;
        };
    };
    /**
     * Returns a string with the first letter in upper case
     * @param {string} string The string to format
     */
    public toUpperCaseBeginning(string: string): string {
        return `${string[0].toUpperCase() + string.slice(1).toLowerCase()}`;
    };
    /**
     * Returns a number from 0 to the provided maximal number
     * @param {number} max The maximum number
     */
    public getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    /**
     * Formats a date into a string value
     * @param {Date | number} date The date or timestamp to format
     */
    public dateFormatter(date: Date | number): string {
        if (typeof date == "number") date = new Date(date);
        return `${this.weekDays[date.getUTCDay()]}, ${this.monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}, ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} UTC`;
    };
    /**
     * Returns true, if the string is an URL
     * @param {string} url The URL to test
     */
    public isURL(string: string) {
        try {
            new URL(string);
        } catch {
            return false
        };
        return true;
    };
    /**
     * Creates a Yes or No question
     * @param {User} user The user the filter matches to 
     * @param {Message} message The message that was created 
     * @param {object} embed The embed object
     * @param {string} commandUsage The command usage
     * @param {Function} yesFunction The function, if the answer is yes 
     * @param {Function} filter The filter to passthrough  
     * @param {number} timeout The time to wait until it auto cancelled 
     */
    public async YesOrNoCollector(user: User, message: Message, embed: { title: string, activity: "leaving" | "creating" | "setting" | "removing" | "banning" | "kicking" | "unbanning" | "nuking", toHandle: string }, commandUsage: string, yesFunction: (reaction?: MessageReaction, user?: User) => unknown | Promise<unknown>, filter?: (reaction: MessageReaction, user: User) => boolean | Promise<boolean>, timeout?: number): Promise<void> {
        if (!filter) filter = (reaction, reactionAuthor) => reactionAuthor.id == user.id && (reaction.emoji.id == this.client.yesEmojiID || reaction.emoji.id == this.client.noEmojiID);
        await message.react(this.client.yesEmojiID);
        await message.react(this.client.noEmojiID);
        const collector = message.createReactionCollector((reaction, user) => filter(reaction, user), { max: 1, time: timeout ? timeout : 30000 });
        collector.on("collect", async (reaction, user) => {
            if (reaction.emoji.id == this.client.yesEmojiID) return await yesFunction(reaction, user);
            else return this.client.createArgumentError(message, { title: embed.title, description: `${this.client.util.toUpperCaseBeginning(embed.activity)} ${embed.toHandle} cancelled!`}, commandUsage);
        });
        collector.on("end", (collected, reason) => {
            if (collected.size == 0) return this.client.createArgumentError(message, { title: "", description: `${this.client.util.toUpperCaseBeginning(embed.activity)} ${embed.toHandle} cancelled!`}, commandUsage);
        });
    };
    /**
     * Checks if a member has the required command permissions
     * @param {TextChannel | NewsChannel} channel The channel to respond to 
     * @param {GuildMember} member The member to check for permissions 
     * @param {Array<PermissionString>} permissions The permissions 
     * @param {Command} command The command used
     * @param {string} prefix The prefix of the guild
     */
    public permissionChecker(channel: TextChannel | NewsChannel, member: GuildMember, permissions: Array<PermissionString>, command: Command, prefix: string) {
        let perms: number = 0;
        for (const permission of permissions) if (member.permissions.has(permission)) perms++;
        if (perms == 0) return channel.send(this.client.createRedEmbed(true, `${prefix}${command.usage}`)
            .setTitle("Permission Manager")
            .setDescription(`${member.id == this.client.user.id ? "I" : "You"} need one of the following permissions to use the command \`${command.name}\`:\n\`${permissions.map(perm => this.client.util.permissionConverted(perm)).join("`, `")}\``));
    };
};

class EmbedFormatter {
    /**
     * Returns a 2048-letter string
     * @param {string} description The description to format
     */
    public description(description: string) {
        return description.length > 2048 ? description.split("").splice(0, 2045).join("") + "..." : description;
    };
    /**
     * Returns a 1024-letter string
     * @param {string} description The field value to format
     */
    public fieldValue(description: string) {
        return description.length > 1024 ? description.split("").splice(0, 1021).join("") + "..." : description;
    };
};