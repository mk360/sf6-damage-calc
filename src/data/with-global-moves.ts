import { MovesetMove, CharacterMoveset } from "@/logic/types/moveset-move";

export interface MovesetWithGlobalMoves extends CharacterMoveset {
    "drive-impact": {
        [k: string]: MovesetMove;
    }
    throw: {
        [k: string]: MovesetMove;
    }
    "drive-rush": {
        [k: string]: MovesetMove;
    }
}

function withGlobalMoves<T extends CharacterMoveset>(moveset: T): MovesetWithGlobalMoves {
    return {
        ...moveset,
        "drive-impact": {
            "HPHK": {
                damage: 800,
                type: "drive-impact"
            }
        },
        "throw": {
            "5LPLK": {
                type: "throw",
                damage: 1220,
            },
            "4LPLK": {
                type: "throw",
                damage: 1220
            },
        },
        "drive-rush": {
            "66": {
                type: "drive-rush",
                damage: 0
            }
        }
    };
};

export default withGlobalMoves;
