import Command, { CommandRunner } from "@root/Command";
import { shop } from "@data/Shop";

export default class ShopCommand extends Command {
    constructor(){
        super({
            name: "shop",
            description: "shows all items of the shop",
            category: "currency"
        });
    };
    run: CommandRunner = async (client, message, args, prefix) => {
        
    };
    private generateEmbed
};