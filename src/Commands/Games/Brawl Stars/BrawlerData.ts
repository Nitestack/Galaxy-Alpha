export const brawlers: Array<{
    name: string,
    rarity: "chromatic" | "legendary" | "mythic" | "epic" | "superRare" | "rare" | "trophyRoadReward" | "startingBrawler",
    type: "figther" | "sharpshooter" | "heavyweight" | "thrower" | "support" | "batter" | "assassin" | "dashingAssassin" | "toxicAssassin" | "stealthyAssassin" | "firebreather",
    description: string,
    offensive: 0 | 1 | 2 | 3 | 4 | 5,
    defense: 0 | 1 | 2 | 3 | 4 | 5,
    utility: 0 | 1 | 2 | 3 | 4 | 5,
    movementSpeed: "normal" | "fast" | "verySlow" | "veryFast" | "slow"
    super: {
        name: string,
        description: string,
        damage: string,
        range: "long" | "normal" | "veryLong" | "short"
    },
    attack: {
        name: string,
        description: string,
        damage: string,
        range: "long" | "normal" | "veryLong" | "short",
        reloadSpeed: "normal" | "veryFast" | "slow" | "verySlow" | "veryFast" | "fast",
        healingFromDamage?: number
    },
    health: number,
    starPowers: Array<{
        name: string,
        description: string
    }>,
    gadgets: Array<{
        name: string,
        description: string,
        chargesPerMatch: number
    }>
}> = [{
    name: "Shelly",
    rarity: "startingBrawler",
    type: "figther",
    description: "Shelly's spread-fire shotgun blasts the other team with buckshot. Her Super destroys cover and keeps her opponents at a distance!",
    offensive: 4,
    defense: 3,
    utility: 2,
    movementSpeed: "normal",
    super: {
        name: "Super Shell",
        description: "Shelly's Suprt Shell obliterates both cover and enemies. Any survivors get knocked back.",
        range: "long",
        damage: "9 x 448"
    },
    attack: {
        name: "Buckshot",
        description: "Shelly's boomstick fires a wide spread of pellets hit, the greater the damage.",
        damage: "5 x 420",
        range: "long",
        reloadSpeed: "normal"
    },
    health: 5320,
    starPowers: [{
        name: "Shell Shock",
        description: "Shelly's Super shells slow down enemies for 4 seconds!"
    }, {
        name: "Band-Aid",
        description: "When Shelly falls below 40% health, she instantly heals for 1800 health. Band-Aid recharges in 15 seconds."
    }],
    gadgets: [{
        name: "Fast Forward",
        description: "Shelly dashes ahead, skipping a few unnecessary steps!",
        chargesPerMatch: 3
    }, {
        name: "Clay Pigeons",
        description: "On activation, Shelly's next main attack focuses the fire ti a smaller area and increases the range.",
        chargesPerMatch: 3
    }]
}];