import Move from "../src/logic/move";
import Combo from "../src/logic/combo";
import { it } from "mocha";
import assert from "node:assert";
import DamageLevels from "@/logic/types/damage-levels";

const StandingHeavyPunch = new Move("5HP", "normal", 800);
const StandingLightPunch = new Move("5LP", "normal", 300);

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

describe("Regular combo scaling", () => {
    beforeEach(() => {
        for (let move of [TatsumakiSenpukyaku, ShinShoryuken, HighBladeKick, Shoryuken, StandingHeavyPunch, CrMK, StandingLightPunch]) {
            move.previousMove = null;
            move.nextMove = null;
        }
    });

    it("should apply full damage to the first two moves", (done) => {
        const combo = new Combo();
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(Shoryuken);
        assert.strictEqual(combo.getComboData({ isCounter: false })?.totalDamage, (Shoryuken.damage as DamageLevels).heavy + (StandingHeavyPunch.damage as number));
        done();
    });

    it("should scale down a special cancelled by a super", (done) => {
        const combo = new Combo();
        combo.addMove(HighBladeKick, true);
        combo.addMove(ShinShoryuken);

        const totalRequired = (HighBladeKick.damage as DamageLevels).heavy + (ShinShoryuken.damage as number) * 0.9;

        assert.strictEqual(combo.getComboData({ isCounter: false })?.totalDamage, totalRequired);
        done();
    });

    it("should not scale a super that's not preceded by a special cancel", () => {
        const combo = new Combo();
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken);

        const data = combo.getComboData({ isCounter: false });
        assert.strictEqual(data?.totalDamage, (StandingHeavyPunch.damage as number) + (TatsumakiSenpukyaku.damage as DamageLevels).overdrive + (Shoryuken.damage as DamageLevels).heavy * 0.9)
    });

    it("should scale the 3rd move of a standard combo by 90%", (done) => {
        const combo = new Combo();
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(HighBladeKick, true);
        combo.addMove(TatsumakiSenpukyaku); // not a true combo, added just to have a different move
        const data = combo.getComboData({ isCounter: false });
        assert.strictEqual(data?.steps[2].scaling, 90);
        done();
    });

    it("should scale the 4th move of a standard combo by 80%", (done) => {
        const combo = new Combo();
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(HighBladeKick);
        combo.addMove(TatsumakiSenpukyaku);
        combo.addMove(Shoryuken);

        const data = combo.getComboData({ isCounter: false });
        assert.strictEqual(data?.steps[3].scaling, 80);
        done();
    });

    it("should add 20% damage for a Punish Counter's 1st move", (done) => {
        const combo = new Combo();
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(HighBladeKick);
        const data = combo.getComboData({ isCounter: true });
        assert.strictEqual(data?.steps[0].damage, (StandingHeavyPunch.damage as number) * 1.2);
        assert.strictEqual(data.totalDamage, 2260);
        done();
    });

    it("should scale down to 80% after a cancelled 2MK", (done) => {
        const combo = new Combo();
        combo.addMove(CrMK, true);
        combo.addMove(HighBladeKick);

        const data = combo.getComboData({ isCounter: false });
        assert.strictEqual(data?.steps[1].scaling, 80);
        done();
    });

    it("should accelerate scaling when starting with a light normal", (done) => {
        const combo = new Combo();
        combo.addMove(StandingLightPunch, true);
        combo.addMove(Shoryuken);
        const data = combo.getComboData({ isCounter: true });
        assert.strictEqual(data?.steps[1].scaling, 90);
        assert.strictEqual(data?.totalDamage, 1620);
        done();
    });
});

describe("Perfect Parry combos", () => {
    it("should halve all scaling", () => {
        const combo = new Combo();
        combo.addMove(StandingHeavyPunch, true);
        combo.addMove(Shoryuken);
        const data = combo.getComboData({ isCounter: false, perfectParry: true });
        assert.strictEqual(data?.totalDamage, ((Shoryuken.damage as DamageLevels).heavy + (StandingHeavyPunch.damage as number)) / 2);
    });
});
