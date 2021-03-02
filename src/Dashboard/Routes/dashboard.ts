import express from 'express';
import { validateGuild } from '@modules/middleware';
import client from "@root/index";
const router = express.Router();
router.get('/dashboard', (req, res) => res.render('Dashboard/index', {
    subTitle: "Dashboard",
    client: client
}));
router.get('/servers/:id', validateGuild,
    async (req, res) => res.render('Dashboard/show', {
        savedGuild: await client.cache.getGuild(req.params.id),
        client: client,
        subTitle: client.guilds.cache.get(req.params.id).name
    }));
router.put('/servers/:id/:module', validateGuild, async (req, res) => {
    try {
        const { id, module } = req.params;
        const savedGuild = await client.cache.getGuild(id);
        savedGuild[module] = req.body;
        res.redirect(`/servers/${id}`);
    } catch {
        res.render('Errors/400');
    };
});
export default router;