import Move from "@/logic/move";

const Moveset: { [k: string]: Omit<Move, "previousMove" | "nextMove" | "input"> } = {
    "5LP": {
        type: "normal",
        damage: 300,
        grounded: true,
    },
    "5MP": {
        type: "normal",
        damage: 600,
        grounded: true,
    },
    "5HP": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "5LK": {
        type: "normal",
        damage: 300,
        grounded: true,
    },
    "5MK": {
        type: "normal",
        damage: 700,
        grounded: true,
    },
    "5HK": {
        type: "normal",
        damage: 900,
        grounded: true,
    },
    "2LP": {
        type: "normal",
        damage: 300,
        grounded: true,
    },
    "2MP": {
        type: "normal",
        damage: 600,
        grounded: true
    },
    "2HP": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "2LK": {
        type: "normal",
        damage: 200,
        grounded: true,
    },
    "2MK": {
        type: "normal",
        damage: 500,
        grounded: true,
    },
    "2HK": {
        type: "normal",
        damage: 900,
        grounded: true,
    },
    "j.LP": {
        type: "normal",
        damage: 300,
        grounded: true,
    },
    "j.MP": {
        type: "normal",
        damage: 700,
        grounded: true,
    },
    "j.HP": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "j.LK": {
        type: "normal",
        damage: 300,
        grounded: true,
    },
    "j.MK": {
        type: "normal",
        damage: 500,
        grounded: true,
    },
    "j.HK": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "6MP": {
        type: "normal",
        damage: 600,
        grounded: true,
    },
    "6HP": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "4HP": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "6HK": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "4HK": {
        type: "normal",
        damage: 800,
        grounded: true,
    },
    "5HP~HK": {
        type: "target-combo",
        damage: 1000,
        grounded: true,
    },
    "5MP~LK~HK": {
        type: "target-combo",
        damage: 1620,
        grounded: true,
    }
};

export default Moveset;
