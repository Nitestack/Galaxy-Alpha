"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.get = void 0;
const auth_client_1 = __importDefault(require("@modules/auth-client"));
const sessions = new Map();
function get(key) {
    return sessions.get(key) ?? create(key);
}
exports.get = get;
;
async function create(key) {
    setTimeout(() => sessions.delete(key), 5 * 60 * 1000);
    await update(key);
    return sessions.get(key);
}
;
async function update(key) {
    return sessions.set(key, {
        authUser: await auth_client_1.default.getUser(key),
        guilds: await getManageableGuilds(await auth_client_1.default.getGuilds(key))
    });
}
exports.update = update;
;
async function getManageableGuilds(authGuilds) {
    try {
        const guilds = [];
        for (const id of authGuilds.keys()) {
            const isManager = authGuilds.get(id).permissions.includes('MANAGE_GUILD');
            if (!isManager)
                continue;
            guilds.push(authGuilds.get(id));
        }
        ;
        guilds.sort((a, b) => {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        return guilds;
    }
    catch (error) {
        console.log(error);
    }
    ;
}
;
//# sourceMappingURL=sessions.js.map