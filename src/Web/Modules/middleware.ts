import { get } from '@modules/sessions';
import { Request, Response, NextFunction } from 'express';
import client from "@root/index";
import { sendError } from "@modules/api-utils";

export async function updateGuilds(req: Request, res: Response, next: NextFunction) {
    try {
        const key = req.cookies.key ?? req.get("Authorization");
        if (key) {
            const { guilds } = await get(key);
            res.locals.guilds = guilds;
        };
    } finally {
        return next();
    };
};

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const key = req.cookies.key ?? req.get("Authorization");
        if (key) {
            const { authUser } = await get(key);
            res.locals.user = authUser;
        };
    } finally {
        return next();
    };
};

export async function updateMusicPlayer(req: Request, res: Response, next: NextFunction) {
    try {
        const requestor = client.guilds.cache.get(req.params.id)?.members.cache.get(res.locals.user.id);
        if (!requestor) throw new TypeError('You shall not pass!');
        res.locals.requestor = requestor;
        res.locals.player = client.queue.get(req.params.id);
        return next();
    } catch (error) {
        sendError(res, { message: error?.message });
    };
};


export async function validateGuild(req: Request, res: Response, next: NextFunction) {
    res.locals.guild = res.locals.guilds.find(g => g.id === req.params.id);
    return res.locals.guild ? next() : res.render('Errors/404', {
        client: client
    });
};

export async function validateUser(req: Request, res: Response, next: NextFunction) {
    return res.locals.user ? next() : res.render('Errors/401', {
        client: client
    });
};