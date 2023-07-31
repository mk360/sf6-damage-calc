import MoveStrength from "../types/move-strength";

function getInputWithStrength(input: string, version: MoveStrength) {
    if (input === "66") return "66";
    const [actionButton] = input.match(/[PK]$/)!;
    const strengthInput = version === "heavy" ? "H" : version === "light" ? "L" : version === "medium" ? "M" : actionButton;

    return input.replace(actionButton, strengthInput + actionButton);
};

export default getInputWithStrength;
