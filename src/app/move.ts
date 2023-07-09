import DamageLevels from "./types/damage-levels";
import MoveType from "./types/move-type";

class Move {
    input: string;
    type: MoveType;
    hits?: number;
    cancelled?: boolean;
    grounded: boolean;
    previousMove: Move | null;
    damage: number | DamageLevels;
    nextMove: Move | null;
    constructor(input: string, type: MoveType, damage: number | { light: number; medium: number; heavy: number; overdrive: number }) {
        this.input = input;
        this.damage = damage;
        this.type = type; 
        this.nextMove = null;
        this.previousMove = null;
        this.grounded = this.type === "normal" && !this.input.startsWith("j.");
    };
}

export default Move;
