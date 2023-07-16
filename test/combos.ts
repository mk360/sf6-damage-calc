import Move from "../src/logic/move";
import Combo from "../src/logic/combo";
import { it } from "mocha";
import assert from "node:assert";
import DamageLevels from "@/logic/types/damage-levels";
import Ryu from "@/data/characters/ryu";

const StandingHeavyPunch = new Move("5HP", "normal", 800);
const StandingHeavyPunch2 = new Move("5HP", "normal", 800);
const StandingLightPunch = new Move("5LP", "normal", 300);

const ShinkuHadoken = new Move("236236P", "super1", 2000);

const ShinHashogeki = new Move("234234P", "super2", 3000);

const DriveRush = new Move("66", "drive-rush", 0);
const DriveRush2 = new Move("66", "drive-rush", 0);

const Shoryuken = new Move("623HP", "special", {
    light: 1100,
    medium: 1200,
    heavy: 1400,
    overdrive: 1600
});

const HighBladeKick = new Move("236HK", "special", {
    light: 1000,
    medium: 1100,
    heavy: 1300,
    overdrive: 800
});

const TatsumakiSenpukyaku = new Move("214KK", "special", {
    light: 800,
    medium: 900,
    heavy: 1000,
    overdrive: 1000
});

const CrMK = new Move("2MK", "normal", 500);

const ShinShoryuken = new Move("236236K", "super3", 4000);

const movesArray = [TatsumakiSenpukyaku, ShinkuHadoken, ShinShoryuken, HighBladeKick, Shoryuken, StandingHeavyPunch, CrMK, StandingLightPunch, DriveRush, StandingHeavyPunch2, DriveRush2];

describe("Regular combo scaling", () => {
    beforeEach(() => {
        for (let move of movesArray) {
            move.previousMove = null;
            move.nextMove = null;
        }
    });

    it("should apply full damage to the first two moves", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(Shoryuken);
        assert.strictEqual(combo.getComboData()?.totalDamage, (Shoryuken.damage as DamageLevels).heavy + (StandingHeavyPunch.damage as number));
        done();
    });

    it("should scale down a special cancelled by a super", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(HighBladeKick, true);
        combo.addMove(ShinShoryuken);

        const totalRequired = (HighBladeKick.damage as DamageLevels).heavy + (ShinShoryuken.damage as number) * 0.9;

        assert.strictEqual(combo.getComboData()?.totalDamage, totalRequired);
        done();
    });

    it("should not scale a super that's not preceded by a special cancel", () => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(ShinShoryuken);

        const data = combo.getComboData();
        assert.strictEqual(data?.totalDamage, 5000);
    });

    it("should scale the 3rd move of a standard combo by 80%", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(HighBladeKick, true);
        combo.addMove(TatsumakiSenpukyaku); // not a true combo, added just to have a different move
        const data = combo.getComboData();
        assert.strictEqual(data?.steps[2].scaling, 80);
        done();
    });

    it("should scale the 4th move of a standard combo by 70%", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(HighBladeKick);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken);

        const data = combo.getComboData();
        assert.strictEqual(data?.steps[3].scaling, 70);
        done();
    });

    it("should add 20% damage for a Punish Counter's 1st move", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(HighBladeKick);
        const data = combo.getComboData({ isCounter: true });
        assert.strictEqual(data?.steps[0].damage, (StandingHeavyPunch.damage as number) * 1.2);
        assert.strictEqual(data.totalDamage, 2260);
        done();
    });

    it("should scale down to 80% after a cancelled starter 2MK", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(CrMK, true);
        combo.addMove(HighBladeKick);

        const data = combo.getComboData();
        assert.strictEqual(data?.steps[1].scaling, 80);
        done();
    });

    it("should accelerate scaling when starting with a light normal", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingLightPunch, true);
        combo.addMove(Shoryuken);
        const data = combo.getComboData();
        assert.strictEqual(data?.steps[1].scaling, 90);
        assert.strictEqual(data?.totalDamage, 1560);
        done();
    });
});

describe("Perfect Parry combos", () => {
    beforeEach(() => {
        for (let move of movesArray) {
            move.previousMove = null;
            move.nextMove = null;
        }
    });

    it("should halve all scaling and damage", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(Shoryuken);
        const data = combo.getComboData({ isCounter: false, perfectParry: true });
        assert.strictEqual(data?.totalDamage, ((Shoryuken.damage as DamageLevels).heavy + (StandingHeavyPunch.damage as number)) / 2);
        done();
    });

    it("should increase scaling by 5% after each combo move", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch);
        combo.addMove(CrMK, true);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken);

        const data = combo.getComboData({ perfectParry: true, isCounter: false });
        // finish test
        done();
    });
});

describe("Drive Rush", () => {
    beforeEach(() => {
        for (let move of movesArray) {
            move.previousMove = null;
            move.nextMove = null;
        }
    });

    it("should add a 15% scaling penalty inside a combo", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(DriveRush, false);
        combo.addMove(StandingHeavyPunch2, true);
        combo.addMove(Shoryuken);
        const data = combo.getComboData();
        assert.strictEqual(data?.totalDamage, 2432);
        done();
    });

    it("should only apply a penalty once throughout the combo", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(DriveRush);
        combo.addMove(StandingHeavyPunch2, true);
        combo.addMove(DriveRush2);
        combo.addMove(Shoryuken);
        const data = combo.getComboData();
        assert.strictEqual(data?.steps[2].scaling, 85);
        assert.strictEqual(data?.steps[4].scaling, 80 * 0.85);
        done();
    });

    it("should stack with Perfect Parry", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(DriveRush);
        combo.addMove(StandingHeavyPunch2);
        const data = combo.getComboData({ perfectParry: true });

        assert.strictEqual(data?.steps[0].scaling, 50);
        assert.strictEqual(data.steps[2].scaling, Math.floor(50 * 0.85));
        done();
    });

    it("should stack with 2MK cancel penalty", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(CrMK, true);
        combo.addMove(DriveRush);
        combo.addMove(StandingLightPunch, true);
        combo.addMove(Shoryuken);
        const data = combo.getComboData();
        done();
    });
})

describe("Supers scaling", () => {
    beforeEach(() => {
        for (let move of movesArray) {
            move.previousMove = null;
            move.nextMove = null;
        }
    });

    it("should be higher than 50% if combo string stays over 50%", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken, true);
        combo.addMove(ShinShoryuken);
        assert.strictEqual(combo.getComboData()?.steps[3].scaling, 60);
        done();
    });

    it("should be at 50% if combo drops to less than 50% and a Lv. 3 Super is used", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken, true);
        combo.addMove(ShinShoryuken);
        assert.strictEqual(combo.getComboData({ perfectParry: true })?.steps[3].scaling, 50);
        done();
    });

    it("should be at 40% if combo drops to less than 40% and a Lv.2 Super is used", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken, true);
        combo.addMove(ShinHashogeki);
        assert.strictEqual(combo.getComboData({ perfectParry: true })?.steps[3].scaling, 40);
        done();
    });

     it("should be at 30% if combo drops to less than 30% and a Lv.1 Super is used", (done) => {
        const combo = new Combo(Ryu);
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(DriveRush);
        combo.addMove(StandingHeavyPunch2, true);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken, true);
        combo.addMove(ShinkuHadoken);

        assert.strictEqual(combo.getComboData({ perfectParry: true })?.steps[5].scaling, 30);
        done();
    });
});
