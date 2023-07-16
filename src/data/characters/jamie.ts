import Character from "@/logic/character";

const Jamie = new Character();
Jamie.powerups = {
    name: "Drink Level",
    baseLevel: 1,
    max: 4,
    currentLevel: 1,
};

Jamie.getScaling = function() {
    return 90 + 5 * this.powerups?.currentLevel!;
};

export default Jamie;
