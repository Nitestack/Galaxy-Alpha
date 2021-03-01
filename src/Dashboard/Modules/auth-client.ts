import OAuthClient from 'disco-oauth';
import bot from "@root/index";

const client = new OAuthClient(bot.user.id, process.env.CLIENT_BETA_SECRET);
client.setRedirect(`${process.env.DASHBOARD_CALLBACK_URL}/auth`);
client.setScopes('identify', 'guilds');
export default client;