import ComboStep from "@/logic/types/combo-step";

function explainStep({ step }: { step: ComboStep }) {
    const explanation: string[] = [];
    if (step.unscaledDamage) {
        explanation.push(`${step.unscaledDamage} base damage at ${step.scaling}% scaling`);
    }

    if (step.scalingEffects) {
        if (step.scalingEffects.extraHits) {
            explanation.push(`adds ${step.scalingEffects.extraHits} hit(s) to combo scaling`);
        }

        if (step.scalingEffects.extraScaling) {
            explanation.push(`adds ${step.scalingEffects.extraScaling}% scaling penalty`);
        }
    }

    return "(" + explanation.join(", ") + ")"
};

export default explainStep;
