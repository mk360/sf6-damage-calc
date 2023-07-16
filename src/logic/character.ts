/**
 * à implémenter :
 * Consommables (Fuhajin Stocks, Denjin Charge)
 * Power-ups cumulables (Drink Level, Médailles)
 * scaling évolutif (Jamie, Kimberly)
 */

import { CharacterMoveset } from "./types/moveset-move";

class Character {
    consumables?: {
        max: number;
        name: string;
    };
    powerups?: {
        name: string;
        max: number;
        currentLevel: 1;
        baseLevel: 1;
    };
    moveset: CharacterMoveset;
    protected _scaling: number;
    constructor() {
        this._scaling = 100;
    }

    getScaling() {
        return this._scaling;
    }
}

export default Character;
