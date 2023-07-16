import Character from "./character";
import Move from "./move";
import DamageLevels from "./types/damage-levels";
import MoveType from "./types/move-type";
import ScalingType from "@/logic/scaling-types";

interface ComboStep {
    move: string;
    damage: number;
    unscaledDamage: number;
    scaling: number;
}

// improvement: the combo engine should not select the move's version; the move itself should determine its own damage output and pass it to the combo.

class Combo {
    starter: Move | null;
    ender: Move | null;
    comboSteps: ComboStep[];

    constructor(private character: Character) {
        this.starter = null;
        this.ender = null;
        this.comboSteps = [];
    }

    removeMove(move: Move) {
        if (move.previousMove) {
            this.ender = move.previousMove;
            if (move.nextMove) {
                move.nextMove.previousMove = move.previousMove;
                move.previousMove.nextMove = move.nextMove;
            }
            move.previousMove = null;
            move.nextMove = null;
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
            move.previousMove = this.ender;
            this.ender = move;
        }
    }

    getTrueMovePercentage(basePercentage: number, moveType: MoveType, cap: number) {
        if (basePercentage < 50 && moveType === "super3") return 50;
        if (basePercentage < 40 && moveType === "super2") return 40;
        if (basePercentage < 30 && moveType === "super1") return 30;
        return Math.max(0.1 * cap, basePercentage);
    }

    getComboData(settings?: Partial<ScalingCapSettings & { isCounter: boolean }>) {
        let totalDamage = 0;
        let currentMove = this.starter;
        let comboHits = 1;
        const usedScaling = this.starter?.strength === "light" && this.starter?.type === "normal" && this.starter?.grounded ? ScalingType.lightNormal : this.starter?.input === "2MK" && this.starter.cancelled ? ScalingType.crMk : ScalingType.general;
        
        const cap = this.getScalingCap(settings?.perfectParry!);
        let scalingPenalty = 0;
        let driveRushPenaltyAdded = false;
    
        while (currentMove) {
            if (currentMove.type === "drive-rush" && currentMove.previousMove?.cancelled) {
                if (!driveRushPenaltyAdded) {
                    scalingPenalty += 0.15 * cap;
                    driveRushPenaltyAdded = true;
                }
                this.comboSteps.push({
                    damage: 0,
                    unscaledDamage: 0,
                    scaling: 0,
                    move: currentMove.input
                });
                if (currentMove.nextMove) {
                    currentMove = currentMove.nextMove;
                }
                continue;
            }
            let moveDamage = this.getBaseMoveDamage(currentMove);
            if (comboHits === 1 && !["super1", "super2", "super3"].includes(currentMove.type) && settings?.isCounter) moveDamage *= 1.2;
            const moveOrderScale = this.getScalingFromOrder(comboHits, cap, usedScaling);
            const scaledPercentage = moveOrderScale * (cap - scalingPenalty) / cap;
            
            const trueMovePercentage = Math.floor(this.getTrueMovePercentage(scaledPercentage, currentMove.type, cap));
            const trueMoveDamage = Math.floor(moveDamage * trueMovePercentage / 100);

            this.comboSteps.push({
                damage: trueMoveDamage,
                unscaledDamage: moveDamage,
                scaling: trueMovePercentage,
                move: currentMove.input
            });

            totalDamage += trueMoveDamage;

            if (currentMove.cancelled && currentMove.type === "special" && currentMove.nextMove?.type === "super3") {
                if (comboHits === 1) {
                    scalingPenalty += 0.1 * cap;
                } else {
                    comboHits++;
                }
            }

            if (currentMove.type === "drive-impact") {
                if (settings?.driveImpact === "punish") {
                    comboHits++;
                }
            }

            currentMove.afterExecution?.({
                previousMove: currentMove.previousMove,
                nextMove: currentMove.nextMove,
                scalingPenalty,
                comboHits,
                usedScaling,

            });

            comboHits++;

            if (currentMove.nextMove) {
                currentMove = currentMove.nextMove;
            }
            else return {
                totalDamage,
                steps: this.comboSteps
            };
        }
    }

    getScalingCap(perfectParry: boolean) {
        let baseScaling = this.character.getScaling();
        if (perfectParry) baseScaling /= 2;
        return Math.floor(baseScaling);
    }

    getScalingFromOrder(order: number, scalingCap: number, usedScaling: number[]) {
        const manualScaling = (usedScaling[order - 1] ?? 10) * (scalingCap / 100);
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
