import Move from "@/logic/move";

interface MovesetMove extends Omit<Move, "previousMove" | "nextMove" | "input" | "grounded" | "cancelled"> {
    canUseConsumable?: true;
}

interface Moveset {
    normals: {
        [k: string]: MovesetMove;
    };
    "target-combos": {
        [k: string]: MovesetMove;
    };
    specials: {
        [k: string]: MovesetMove;
    };
    supers: {
        [k: string]: MovesetMove;
    };
    throws: {
        [k: string]: MovesetMove;   
    };
}

const Moveset: Moveset = {
    "normals": {
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
    "target-combos": {
        "5HP~HK": {
            type: "target-combo",
            damage: 1000,
        },
        "5MP~LK~HK": {
            type: "target-combo",
            damage: 1620,
        },
    },
    "throws": {
        "5LPLK": {
            type: "throw",
            damage: 1220,
        },
        "4LPLK": {
            type: "throw",
            damage: 1220
        },
    },
    "HPHK": {
        type: "drive-impact",
        damage: 800
    },
    specials: {
        "236P": {
            damage: {
                light: 600,
                medium: 600,
                heavy: 600,
                overdrive: 800
            },
            type: "special",
            canUseConsumable: true,
        },
        "623P": {
            damage: {
                light: 1100,
                medium: 1200,
                heavy: 1400,
                overdrive: 1600
            },
            type: "special"
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
            canUseConsumable: true,
        }
    }
};

export default Moveset;
