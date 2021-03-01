export const shop: Array<ShopItem> = [{
    name: "Rob Protector",
    description: "Protects you against one rob",
    id: "rob"
}];

export interface ShopItem {
    name: string;
    description: string;
    id: string;
    price: string;
    emojiToString: string;
    usage: Function;
};