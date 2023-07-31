import { CharacterMoveset } from "@/logic/types/moveset-move";
import withGlobalMoves from "@/data/with-global-moves";
import Move from "@/logic/move";

const Moveset: CharacterMoveset = {
    "normal": {
        "5LP": {
            type: "normal",
            damage: 300,
        },
        "5MP": {
            type: "normal",
            damage: 600,
        },
        "5HP": {
            type: "normal",
            damage: 800,
        },
        "5LK": {
            type: "normal",
            damage: 300,  
        },
        "5MK": {
            type: "normal",
            damage: 700,
        },
        "5HK": {
            type: "normal",
            damage: 900,
        },
        "2LP": {
            type: "normal",
            damage: 300,
        },
        "2MP": {
            type: "normal",
            damage: 600,
        },
        "2HP": {
            type: "normal",
            damage: 800,
        },
        "2LK": {
            type: "normal",
            damage: 200,  
        },
        "2MK": {
            type: "normal",
            damage: 500,
        },
        "2HK": {
            type: "normal",
            damage: 900,
        },
        "j.LP": {
            type: "normal",
            damage: 300,
        },
        "j.MP": {
            type: "normal",
            damage: 700,
        },
        "j.HP": {
            type: "normal",
            damage: 800,
        },
        "j.LK": {
            type: "normal",
            damage: 300,
        },
        "j.MK": {
            type: "normal",
            damage: 500,
        },
        "j.HK": {
            type: "normal",
            damage: 800,
        },
        "6MP": {
            type: "normal",
            damage: 600,
        },
        "6HP": {
            type: "normal",
            damage: 800,
            afterExecution() {
                return {
                    extraHits: 1
                };
            }
        },
        "4HP": {
            type: "normal",
            damage: 800,
        },
        "6HK": {
            type: "normal",
            damage: 800,
        },
        "4HK": {
            type: "normal",
            damage: 800,
        },
    },
    "target-combo": {
        "5HP~HK": {
            type: "target-combo",
            damage: 1000,
        },
        "5MP~LK~HK": {
            type: "target-combo",
            damage: 1620,
        },
    },
    special: {
        "236P": {
            damage: {
                light: 600,
                medium: 600,
                heavy: 600,
                overdrive: 800
            },
            type: "special",
        },
        "236K": {
            damage: {
                light: 1000,
                medium: 1100,
                heavy: 1300,
                overdrive: 800
            },
            type: "special",
            afterExecution(this: Move, { comboHits }) {
                if (comboHits === 1) {
                    return {
                        extraScaling: 10,
                    };
                }
            },
        },
        "214K": {
            damage: {
                light: 800,
                medium: 900,
                heavy: 1000,
                overdrive: 1000
            },
            type: "special",
        },
        "214P": {
            damage: {
                light: 700,
                medium: 800,
                heavy: 800,
                overdrive: 900
            },
            type: "special",
        },
        "623P": {
            damage: {
                light: 1100,
                medium: 1200,
                heavy: 1400,
                overdrive: 1600
            },
            type: "special",
        },
    },
    super1: {
        "236236P": {
            damage: 2000,
            type: "super1",
        },
    },
    super2: {
        "214214P": {
            damage: 3000,
            type: "super2"
        },
    },
    super3: {
        "236236K": {
            damage: 4000,
            type: "super3"
        },
        "CA-236236K": {
            damage: 4500,
            type: "super3"
        }
    }
};

export default withGlobalMoves(Moveset);
