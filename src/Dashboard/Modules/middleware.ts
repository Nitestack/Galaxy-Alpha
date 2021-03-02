import { get } from '@modules/sessions';
import { Request, Response } from 'express';
import client from "@root/index";

export async function updateGuilds (req: Request, res: Response, next: Function) {
    try {
        const key = req.cookies.key;
        if (key) {
            const { guilds } = await get(key);
            res.locals.guilds = guilds;
        };
    } finally {
        return next();
    };
};

export async function updateUser (req: Request, res: Response, next: Function) {
    try {
        const key = req.cookies.key;
        if (key) {
            const { authUser } = await get(key);
            res.locals.user = authUser;
        };
    } finally {
        return next();
    };
};

export async function validateGuild (req: Request, res: Response, next: Function) {
    res.locals.guild = res.locals.guilds.find(g => g.id === req.params.id);
    return res.locals.guild ? next() : res.render('Errors/404', {
        client: client,
        subTitle: "Error 404"
    });
};

export async function validateUser (req: Request, res: Response, next: Function) {
    return res.locals.user ? next() : res.render('Errors/401', {
        client: client,
        subTitle: "Error 401"
    });
};