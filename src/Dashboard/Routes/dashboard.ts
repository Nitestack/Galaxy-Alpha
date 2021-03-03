import express from 'express';
import { validateGuild } from '@modules/middleware';
import client from "@root/index";
const router = express.Router();
router.get('/dashboard', (req, res) => res.render('Dashboard/index', {
    subTitle: "Dashboard",
    client: client
}));
router.get('/servers/:id', validateGuild, async (req, res) => {
    if (client.guilds.cache.has(req.params.id)) res.render('Dashboard/show', {
        savedGuild: await client.cache.getGuild(req.params.id),
        users: client.users.cache,
        player: res.locals.player,
        client: client,
        subTitle: client.guilds.cache.get(req.params.id).name,
        key: req.cookies.key
    })
    else res.render("Dashboard/invite", {
        client: client
    });
});
router.put('/servers/:id/:module', validateGuild, async (req, res) => {
    try {
        const { id, module } = req.params;
        const savedGuild = await client.cache.getGuild(id);
        savedGuild[module] = req.body;
        res.redirect(`/servers/${id}`);
    } catch {
        res.render('Errors/400', {
            client: client
        });
    };
});
export default router;