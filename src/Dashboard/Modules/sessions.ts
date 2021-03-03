import authClient from "@modules/auth-client";
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
    try {
        const guilds: Array<Guild> = [];
        for (const id of authGuilds.keys()) {
            const isManager = authGuilds.get(id).permissions.includes('MANAGE_GUILD');
            if (!isManager) continue;
            guilds.push(authGuilds.get(id));
        };
        guilds.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        return guilds;
    } catch (error) {
        console.log(error);
    };
};