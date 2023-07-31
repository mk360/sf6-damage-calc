function getInputStrength(input: string) {
    const [, matchedStrengthFromInput] = input.match(/([LMHPK]+)[PK]/)!;
    switch (matchedStrengthFromInput) {
        case "L": return "light";
        case "M": return "medium";
        case "H": return "heavy";
        // zangief lariat
        case "PP":
        case "KK": return "overdrive";
        default: return "medium";
    }
};

export default getInputStrength;
