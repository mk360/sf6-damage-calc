/**
 * à implémenter :
 * Consommables (Fuhajin Stocks, Denjin Charge)
 * Power-ups cumulables (Drink Level, Médailles)
 * scaling évolutif (Jamie, Kimberly)
 */

import Moveset from "@/data/ryu";

class Character {
    consumables?: {
        max: number;
        name: string;
    };
    powerups?: {
        name: string;
    };
    moveset: Moveset;
    scaling: number;
    constructor() {
        this.scaling = 100;
    }
}

export default Character;
