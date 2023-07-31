import DamageLevels from "./types/damage-levels";
import MoveType from "./types/move-type";

class Move {
    input: string;
    type: MoveType;
    hits?: number;
    cancelled?: boolean;
    grounded: boolean;
    strength: "light" | "medium" | "heavy" | "overdrive";
    previousMove: Move | null;
    damage: number | DamageLevels;
    afterExecution?({ usedScaling, scalingPenalty, nextMove, previousMove, comboHits }: AfterMoveExecutionArgs): {
        extraHits?: number;
        extraScaling?: number;
        newScalingMode?: number[];
    } | undefined;
    nextMove: Move | null;
    constructor(input: string, type: MoveType, damage: number | DamageLevels, version?: "light" | "medium" | "heavy" | "overdrive") {
        this.input = input;
        this.damage = damage;
        this.type = type; 
        this.nextMove = null;
        this.previousMove = null;
        this.grounded = this.type === "normal" && !this.input.startsWith("j.");
        if (this.type === "special" && version) {
            this.strength = version;
            this.damage = (this.damage as DamageLevels)[this.strength];
        } else if (this.type === "normal") {
            const [, matchedStrengthFromInput] = input.match(/([LMHPK])[PK]/)!;
            this.damage = damage;
            this.strength = this.strength = matchedStrengthFromInput === "L" ? "light" : matchedStrengthFromInput === "M" ? "medium" : matchedStrengthFromInput === "H" ? "heavy" : "medium";
        } else  {
            this.damage = damage;
        }
    };
}

export interface AfterMoveExecutionArgs {
    usedScaling: number[];
    scalingPenalty: number;
    nextMove: Move | null;
    previousMove: Move | null;
    comboHits: number;
};

export default Move;
