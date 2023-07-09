import Move from "./move";
import DamageLevels from "./types/damage-levels";
import MoveType from "./types/move-type";

interface ComboStep {
    move: string;
    damage: number;
    unscaledDamage: number;
    scaling: number;
}

class Combo {
    starter: Move | null;
    ender: Move | null;
    comboSteps: ComboStep[];

    constructor() {
        this.starter = null;
        this.ender = null;
        this.comboSteps = [];
    }

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
        else if (this.ender) {
            this.ender.nextMove = move;
            this.ender = move;
        }
    }

    getMoveStrength(input: string) {
        const [match] = input.match(/[LMH]/) ?? ["any"];
        return match === "M" ? "medium" : match === "L" ? "light" : match === "H" ? "heavy" : "any";
    }

    getComboData(settings: Partial<ScalingCapSettings> & { isCounter: boolean }) {
        const { isCounter } = settings;
        let totalDamage = 0;
        let currentMove = this.starter;
        let comboMoveOrder = 1;

        const cap = this.getScalingCap(settings.perfectParry!, 0);
    
        while (currentMove) {
            const appliedScaling = this.getScalingFromOrder(comboMoveOrder, currentMove.type, cap);
            let moveDamage = this.getBaseMoveDamage(currentMove);
            const starterIsCounter = comboMoveOrder === 1 && isCounter;
            let moveDamageWithCounter = moveDamage * (starterIsCounter ? 1.2 : 1);
            const isLightStarter = comboMoveOrder === 1 && this.getMoveStrength(currentMove.input) === "light" && currentMove.grounded;
            const is2MKStarter = comboMoveOrder === 1 && currentMove.input === "2MK" && currentMove.cancelled;
            let trueMoveDamage = Math.floor(moveDamageWithCounter * appliedScaling / 100);

            const comboStep: ComboStep = {
                move: currentMove.input,
                unscaledDamage: moveDamageWithCounter,
                damage: trueMoveDamage,
                scaling: appliedScaling,
            };

            this.comboSteps.push(comboStep);

            totalDamage += trueMoveDamage;
            if (currentMove.type === "special" && currentMove.nextMove?.type === "super3" && currentMove.cancelled) {
                comboMoveOrder++;
            }
            if (isLightStarter) {
                comboMoveOrder++
            }
            if (is2MKStarter) {
                comboMoveOrder += 2;
            }
            if (currentMove.type === "target-combo") {
                comboMoveOrder += currentMove.hits!;
            }
            comboMoveOrder++;
            if (currentMove.nextMove) {
                currentMove = currentMove.nextMove;
            }
            else return {
                totalDamage,
                steps: this.comboSteps
            };
        }
    }

    getScalingCap(perfectParry: boolean, scalingBuff: number) {
        let scaling = 100;
        if (perfectParry) scaling /= 2;
        if (scalingBuff) scaling *= (1 + scalingBuff);
        return Math.floor(scaling);
    }

    getScalingFromOrder(order: number, moveType: MoveType, scalingCap: number) {
        if (order <= 2) return scalingCap;
        if (order >= 10) return 10;
        const manualScaling = scalingCap - ((order - 2)  * (scalingCap / 10));
        if (moveType === "super3") return Math.max(50, manualScaling);
        if (moveType === "super2") return Math.max(30, manualScaling);
        if (moveType === "super1") return Math.max(20, manualScaling);
        return Math.max(10, manualScaling);
    }

    getBaseMoveDamage(move: Move) {
        if (move.type === "special") {
            const moveDamage = move.damage as DamageLevels;
            const [endingInput] = move.input.match(/[LMHPK][PK]/)!;

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

interface ScalingCapSettings {
    perfectParry: boolean;
    driveImpact: "wall-splat" | "stun" | "punish" | "raw-hit";
}

export default Combo;
