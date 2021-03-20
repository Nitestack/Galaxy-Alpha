"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shop = void 0;
const index_1 = __importDefault(require("@root/index"));
exports.shop = [{
        name: "19$ Fornite Card",
        description: "A Fortnite Card to buy v-bucks",
        id: "fornite-card",
        price: 19000,
        emojiToString: "💳",
        usage: (message) => {
            message.channel.send(index_1.default.createEmbed()
                .setTitle("Currency Manager")
                .setDescription("You used the Fortnite card! `20000`$ were deposited to your wallet! Buy some v-bucks!"));
        }
    }];
;
//# sourceMappingURL=Shop.js.map