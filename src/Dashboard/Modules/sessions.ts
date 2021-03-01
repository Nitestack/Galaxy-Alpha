import authClient from "@modules/auth-client";
import bot from "@root/index";
import { User, Guild } from "disco-oauth";

const sessions: Map<string, {
    authUser: User,
    guilds: Array<Guild>
}> = new Map();

export function get(key: string) {
    return sessions.get(key) ?? create(key);
};

async function create(key: string) {
    setTimeout(() => sessions.delete(key), 5 * 60 * 1000);
    await update(key);
    return sessions.get(key);
};

export async function update(key: string) {
    return sessions.set(key, {
        authUser: await authClient.getUser(key),
        guilds: await getManageableGuilds(await authClient.getGuilds(key))
    });
};

async function getManageableGuilds(authGuilds: Map<string, Guild>) {
    const guilds = [];
    for (const id of authGuilds.keys()) {
        const isManager = authGuilds.get(id).permissions.includes('MANAGE_GUILD');
        const guild = await bot.guilds.fetch(id, false, false);
        if (!guild || !isManager) continue;
        guilds.push(guild);
    };
    return guilds;
};