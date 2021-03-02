import { Message } from "discord.js";
import client from "@root/index";

export const shop: Array<ShopItem> = [{
    name: "19$ Fornite Card",
    description: "A Fortnite Card to buy v-bucks",
    id: "fornite-card",
    price: 19000,
    emojiToString: "💳",
    usage: (message: Message) => { 
        message.channel.send(client.createEmbed()
            .setTitle("Currency Manager")
            .setDescription("You used the Fortnite card! `20000`$ were deposited to your wallet! Buy some v-bucks!"));
    }
}];

export interface ShopItem {
    name: string;
    description: string;
    id: string;
    price: number;
    emojiToString: string;
    usage: Function;
};