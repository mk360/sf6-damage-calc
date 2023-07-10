import DamageLevels from "./types/damage-levels";
import MoveType from "./types/move-type";

// improvement: find a way to allow multiple similar moves in a combo without them referencing the same object in memory

class Move {
    input: string;
    type: MoveType;
    hits?: number;
    cancelled?: boolean;
    grounded: boolean;
    previousMove: Move | null;
    damage: number | DamageLevels;
    nextMove: Move | null;
    constructor(input: string, type: MoveType, damage: number | DamageLevels) {
        this.input = input;
        this.damage = damage;
        this.type = type; 
        this.nextMove = null;
        this.previousMove = null;
        this.grounded = this.type === "normal" && !this.input.startsWith("j.");
    };
}

export default Move;
