import express from 'express';
import authClient from '@modules/auth-client';
import { update } from '@modules/sessions';
import client from "@root/index";

const router = express.Router();

router.get('/invite', (req, res) => res.redirect(client.inviteLink));

router.get('/login', (req, res) => res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&redirect_uri=${process.env.DASHBOARD_CALLBACK_URL.replace(/\//g, "%2F").replace(/:/g, "%3A")}/auth&response_type=code&scope=guilds%20identify`));

router.get('/auth-guild', async (req, res) => {
    try {
        const key = res.cookies.get('key');
        await update(key);
    } finally {
        res.redirect('/dashboard');
    };
});
router.get('/auth', async (req, res) => {
    try {
        const code = req.query.code;
        const key = await authClient.getAccess(code);
        res.cookie('key', key);
        res.redirect('/dashboard');
    } catch {
        res.redirect('/');
    };
});
router.get('/logout', (req, res) => {
    res.cookie("key", "");
    res.redirect('/');
});
export default router;