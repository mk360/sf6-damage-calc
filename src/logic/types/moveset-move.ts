import Move from "../move";

export interface MovesetMove extends Omit<Move, "strength" | "previousMove" | "nextMove" | "input" | "grounded" | "cancelled"> {
    canUseConsumable?: true;
}

export interface CharacterMoveset {
    normal: {
        [k: string]: MovesetMove;
    };
    "target-combo": {
        [k: string]: MovesetMove;
    };
    special: {
        [k: string]: MovesetMove;
    };
    super1: {
        [k: string]: MovesetMove;
    };
    super2: {
        [k: string]: MovesetMove;
    };
    super3: {
        [k: string]: MovesetMove;
    };
}