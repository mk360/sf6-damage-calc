import MoveStrength from "@/app/types/move-strength";
import MoveType from "@/logic/types/move-type";

export interface IComboMove {
    type: Exclude<MoveType, "special">;
    input: string;
    id: string;
    cancelled?: boolean;
}

export interface ISpecialMove {
    type: "special";
    input: string;
    id: string;
    version: MoveStrength;
    cancelled?: boolean;
}
