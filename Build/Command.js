"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
;
;
class Command {
    /**
     * @param {CommandInfo} info The command informations
     */
    constructor(info) {
        this.run = async (client, message, args, prefix) => {
            throw new Error(`${this.constructor.name} doesn't have a run() method.`);
        };
        this.name = info.name ? info.name : null;
        this.aliases = info.aliases ? info.aliases : null;
        this.description = info.description ? info.description : null;
        this.category = info.category ? info.category : null;
        this.usage = info.usage ? info.usage : info.name;
        this.cooldown = info.cooldown ? info.cooldown : "3s";
        this.userPermissions = info.userPermissions ? info.userPermissions : null;
        this.clientPermissions = info.clientPermissions ? info.clientPermissions : null;
        this.developerOnly = info.developerOnly ? info.developerOnly : false;
        this.ownerOnly = info.ownerOnly ? info.ownerOnly : false;
        this.guildOnly = info.guildOnly ? info.guildOnly : false;
        this.dmOnly = info.dmOnly ? info.dmOnly : false;
        this.newsChannelOnly = info.newsChannelOnly ? info.newsChannelOnly : false;
        this.textChannelOnly = info.textChannelOnly ? info.textChannelOnly : false;
        this.requiredRoles = info.requiredRoles ? info.requiredRoles : null;
        this.subCommands = info.subCommands ? info.subCommands : null;
        this.args = info.args ? info.args : null;
    }
    ;
}
exports.default = Command;
;
//# sourceMappingURL=Command.js.map