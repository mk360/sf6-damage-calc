import ScalingEffects from "./scaling-effects";

interface ComboStep {
    move: string;
    damage: number;
    unscaledDamage: number;
    scaling: number;
    scalingEffects?: ScalingEffects;
}

export default ComboStep;
