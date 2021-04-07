import express from 'express';
import { validateGuild, validateUser } from '@modules/middleware';
import client from "@root/index";
import { CustomCommand } from '@models/guild';
import { NewsChannel, TextChannel } from 'discord.js';
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
/*SETTINGS*/
router.post("/servers/:id/settings/:methodForValue/:setting", validateGuild, async (req, res) => {
    try {
        const method = req.params.methodForValue;
        const guild = await client.cache.getGuild(req.params.id);
        if (!guild || !Object.keys(guild).includes(req.params.setting)) res.render("Errors/401", {
            client: client
        });
        let guildElement = guild[req.params.setting];
        const element = req.body[req.params.setting];
        if (method.toLowerCase() == "push") {
            if (!guildElement.includes(element)) (guildElement as Array<any>).push(element);
        } else if (method.toLowerCase() == "set") guildElement = element;
        else if (method.toLowerCase() == "remove") {
            if (Array.isArray(guildElement)) {
                if (guildElement.includes(element)) (guildElement as Array<any>).splice(guildElement.indexOf(element), 1);
            } else guildElement = null;
        };
        guild[req.params.setting] = guildElement;
        res.redirect("/servers/" + req.params.id);
    } catch {
        res.render("Errors/401", {
            client: client
        });
    };
});
/*CUSTOM COMMAND*/
router.post("/servers/:id/customcommand/:methodValue", validateGuild, async (req, res) => {
    try {
        const method = req.params.methodValue;
        if (method.toLowerCase() == "create") {
            const { name, aliases, allowedRoles, notAllowedRoles, allowedChannels, notAllowedChannels, answers, random } = req.body;
            const newCommand: CustomCommand = {
                name: name.toLowerCase(),
                guildID: req.params.id,
                aliases: aliases ? (Array.isArray(aliases) ? aliases : [aliases]) : [],
                allowedRoles: allowedRoles ? (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]) : [],
                notAllowedRoles: notAllowedRoles ? (Array.isArray(notAllowedRoles) ? notAllowedRoles : [notAllowedRoles]) : [],
                allowedChannels: allowedChannels ? (Array.isArray(allowedChannels) ? allowedChannels : [allowedChannels]) : [],
                notAllowedChannels: notAllowedChannels ? (Array.isArray(notAllowedChannels) ? notAllowedChannels : [notAllowedChannels]) : [],
                answers: Array.isArray(answers) ? answers : [answers],
                random: random?.toLowerCase() == "on" ? true : false
            };
            client.cache.customCommands.set(`${req.params.id}-${name.toLowerCase()}`, newCommand);
            client.cache.guilds.get(req.params.id).customCommands.push(newCommand);
        } else if (method.toLowerCase() == "delete") {
            const { name } = req.body;
            const command = await client.cache.getCustomCommand(req.params.id, name);
            if (!command) res.render("Errors/401", {
                client: client
            });
            client.commands.delete(`${req.params.id}-${name.toLowerCase()}`);
            client.cache.guilds.get(req.params.id).customCommands.splice(client.cache.guilds.get(req.params.id).customCommands.indexOf(command), 1);
        };
        res.redirect("/servers/" + req.params.id);
    } catch {
        res.render("Errors/401", {
            client: client
        });
    };
});
/**ANNOUNCER**/
router.post("/servers/:id/announcer/:userID", validateGuild, async (req, res) => {
    try {
        const { message, channelID, title } = req.body;
        const channel: TextChannel | NewsChannel = client.channels.cache.get(channelID) as TextChannel | NewsChannel;
        const user = client.users.cache.get(req.params.userID);
        if (!channel || !user) res.render("Errors/401", {
            client: client
        });
        await channel.send(client.createEmbed()
            .setTitle(title ? title : "Announcement")
            .setDescription(message)
            .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true })));
        res.redirect("/servers/" + req.params.id);
    } catch {
        res.render("Errors/401", {
            client: client
        });
    };
});
/*PASSIVE*/
router.post("/users/passive/:id", validateUser, async (req, res) => {
    try {
        const userProfile = await client.cache.getCurrency(req.params.id);
        const { passive } = req.body;
        userProfile.passive = passive?.toLowerCase() == "on" ? true : false;
        res.redirect("/dashboard");
    } catch {
        res.render("Errors/401", {
            client: client
        });
    };
});
export default router;