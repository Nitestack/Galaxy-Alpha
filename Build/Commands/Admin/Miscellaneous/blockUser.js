"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("@root/Command"));
class BlockUserCommand extends Command_1.default {
    constructor() {
        super({
            name: "blockuser",
            description: "blocks an user from using any commands",
            category: "developer",
            usage: "blockuser <@User/User ID>",
            developerOnly: true,
            args: [{
                    type: "realUser",
                    required: true,
                    index: 1,
                    errorMessage: "You have to mention an user or provide an user ID!",
                    errorTitle: "❌ Block User Manager"
                }]
        });
        this.run = async (client, message, args, prefix) => {
            const manager = "❌ Block User Manager";
            const user = args[0];
            const clientData = client.cache.getClientData();
            if (client.developers.includes(user.id) || client.contributors.includes(user.id))
                return client.createArgumentError(message, { title: manager, description: `${user} is a developer or a contributor! You don't have the permission to do this!` }, this.usage);
            if (clientData.blockedUser.includes(user.id))
                return client.createArgumentError(message, { title: manager, description: `${user} is already on the blacklisted bot user list!` }, this.usage);
            client.cache.clientData.blockedUser.push(user.id);
            return client.createSuccess(message, { title: manager, description: `Successfully added ${user} to the blacklist!` });
        };
    }
    ;
}
exports.default = BlockUserCommand;
;
//# sourceMappingURL=blockUser.js.map