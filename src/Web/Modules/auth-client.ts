import OAuthClient from 'disco-oauth';
import client from "@root/index";

const bot = new OAuthClient(client.user.id, client.secret);
bot.setRedirect(`${process.env.DASHBOARD_CALLBACK_URL}/auth`);
bot.setScopes('identify', 'guilds');
export default bot;