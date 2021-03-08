import { PermissionString } from "discord.js";

export default class GalaxyAlphaUtil {
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
            new URL(string) 
        } catch { 
            return false 
        };
        return true;
    };
    /**
     * 
     */
    public embedDescriptionLimiter(description: string) {
        return description.length > 2048 ? description.split("").splice(0, 2045).join("") + "..." : description;
    };
};