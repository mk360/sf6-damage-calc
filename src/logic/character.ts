/**
 * à implémenter :
 * Consommables (Fuhajin Stocks, Denjin Charge)
 * Power-ups cumulables (Drink Level, Médailles)
 * scaling évolutif (Jamie, Kimberly)
 */

class Character {
    consumables?: {
        allowedInputs: string[];
        max: number;
        name: string;
    };
    powerups?: {
        name: string;
    };
    scaling: number;
    constructor() {
        this.scaling = 100;
    }
}