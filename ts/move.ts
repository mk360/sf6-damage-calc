interface DamageLevels {
    light: number;
    medium: number;
    heavy: number;
    overdrive: number;
}

type MoveType = "normal" | "target-combo" | "special" | "super1" | "super2" | "super3" | "drive-rush";

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

const DriveRush = new Move("66", "drive-rush", 0);

class Combo {
    starter: Move | null;
    ender: Move;

    removeMove(move: Move) {
        if (move.previousMove) {
            this.ender = move.previousMove;
            move.previousMove.nextMove = null;
            move.previousMove = null;
        } else {
            console.warn("Cannot remove a move on top of the combo");
        }
    }

    addMove(move: Move, cancelled = false) {
        move.cancelled = cancelled ?? false;
        if (!this.starter) {
            this.starter = move;
            this.ender = move;
        }
        else {
            this.ender.nextMove = move;
            this.ender = move;
        }
    }

    getMoveStrength(input: string) {
        const [match] = input.match(/[LMH]/) ?? ["any"];
        return match === "M" ? "medium" : match === "L" ? "light" : match === "H" ? "heavy" : "any";
    }

    getComboData(isCounter: boolean) {
        let totalDamage = 0;
        let currentMove = this.starter;
        let comboMoveOrder = 1;
        let scaling = 100;
        
        while (currentMove) {
            const scalingFromOrder = this.getScalingFromOrder(comboMoveOrder, currentMove.type);
            let moveDamage = this.getBaseMoveDamage(currentMove);
            const starterIsCounter = comboMoveOrder === 1 && isCounter;
            const isLightStarter = comboMoveOrder === 1 && this.getMoveStrength(currentMove.input) === "light" && currentMove.grounded;
            const is2MKStarter = comboMoveOrder === 1 && currentMove.input === "2MK" && currentMove.cancelled;
            let moveDamageWithCounter = moveDamage * (starterIsCounter ? 1.2 : 1);
            let trueMoveDamage = Math.floor(moveDamageWithCounter * scalingFromOrder / 100);
            totalDamage += trueMoveDamage;
            if (currentMove.type === "super3" && currentMove.previousMove?.type === "special" && currentMove.previousMove?.cancelled) {
                comboMoveOrder++;
            }
            if (isLightStarter) {
                comboMoveOrder++
            }
            if (is2MKStarter) {
                comboMoveOrder += 2;
            }
            if (currentMove.nextMove) {
                comboMoveOrder += currentMove.hits || 1;
                currentMove = currentMove.nextMove;
            }
            else return totalDamage;
        }
    }

    getScalingCap(perfectParry: boolean, scalingBuff: number) {
        let scaling = 100;
        if (perfectParry) scaling /= 2;
        if (scalingBuff) scaling *= (1 + scalingBuff);
        return Math.floor(scaling);
    }

    getScalingFromOrder(order: number, moveType: MoveType) {
        if (order <= 2) return 100;
        if (order >= 10) return 10;
        const manualScaling = 100 - ((order - 1) * 10);
        if (moveType === "super3") return Math.max(50, manualScaling);
        if (moveType === "super2") return Math.max(30, manualScaling);
        if (moveType === "super1") return Math.max(20, manualScaling);
        return Math.max(10, manualScaling);
    }

    getBaseMoveDamage(move: Move) {
        if (move.type === "special") {
            const moveDamage = move.damage as DamageLevels;
            const [endingInput] = move.input.match(/[LMH][PK]/)!;

            switch (true) {
                case endingInput === "HP" || endingInput === "HK": return moveDamage.heavy;
                case endingInput === "MP" || endingInput === "MK": return moveDamage.medium;
                case endingInput === "LP" || endingInput === "LK": return moveDamage.light;
                case endingInput === "PP" || endingInput === "KK": return moveDamage.overdrive;
            }
        }

        return move.damage as number;
    }

    printCombo() {
        let comboMoves: string[] = [];
        let currentMove = this.starter;
        if (!this.starter) return "";
        while (currentMove) {
            comboMoves.push(currentMove.input);
            currentMove = currentMove.nextMove;
        }
        return comboMoves.join(", ");
    }
}

const ShortUppercut = new Move("4HP", "normal", 800);
const HighBladeKick = new Move("236HK", "special", {
    light: 1000,
    medium: 1100,
    heavy: 1300,
    overdrive: 800,
});

HighBladeKick.hits = 2;

const ShinShoryuken = new Move("236236K", "super3", 4000);

const combo = new Combo();
combo.addMove(ShortUppercut, true);
combo.addMove(HighBladeKick, true);
combo.addMove(ShinShoryuken);

console.log(combo.getComboData(true), combo.printCombo());
