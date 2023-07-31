"use client";

import Movesets from "@/data/movesets";
import MoveButton from "./move-button";
import style from "./style.module.scss";
import SpecialButton from "./special-button";
import { useState } from "react";
import Combo from "@/logic/combo";
import * as Characters from "@/data/characters";
import shortid from "shortid";
import ComboMove from "./combo-move";
import { IComboMove, ISpecialMove } from "../../../types/combo-move-interface";
import MoveCancelIndicator from "./move-cancel-indicator";
import Move from "@/logic/move";
import ComboStep from "@/logic/types/combo-step";
import getInputWithStrength from "@/utils/get-input-with-strength";
import MoveStrength from "@/types/move-strength";
import MoveType from "@/logic/types/move-type";
import DriveRushButton from "./drive-rush-button";
import explainStep from "@/logic/get-step-explanation";

function CharacterPage({ params: { character } }: { params: { character: keyof typeof Characters } }) {
    const x = Movesets[character as keyof typeof Movesets];
    const [comboMoves, setCombo] = useState<Array<IComboMove | ISpecialMove>>([]);
    const [comboContext, setComboContext] = useState("regular");
    const [comboResult, setComboResult] = useState<{
        totalDamage: number;
        steps: ComboStep[];
    }>({ totalDamage: 0, steps: [] });

    function addComboMove(move: Omit<IComboMove, "id" >) {
        const moveCopy: IComboMove = {...move, id: shortid() };
        setCombo((combo) => [...combo, moveCopy]);
    }

    function removeMove(moveIndex: number) {
        const comboCopy = [...comboMoves];
        comboCopy.splice(moveIndex, 1);
        setCombo(comboCopy);
    }

    function addSpecialMove({ input, version }: { input: string; version: MoveStrength }) {
        const moveCopy: ISpecialMove = {
            id: shortid(),
            version,
            input,
            type: "special"
        };

        setCombo((combo) => [...combo, moveCopy]);
    };

    return (
        <>
            <fieldset>
                <legend>Combo Start</legend>
                <div className={style["combo-contexts"]}>
                    <div><input onChange={() => {
                    setComboContext("regular");
                }} type="radio" className={style["combo-context-radio"]} id="regular-combo" value="regular" name="combo-start" /><label className={style["combo-start"]} htmlFor="regular-combo">Regular Combo</label> </div>
                <div><input onChange={() => {
                    setComboContext("punish-counter");
                }} type="radio" id="punish-counter" value="punish-counter" name="combo-start" className={style["combo-context-radio"]} /><label className={style["combo-start"]} htmlFor="punish-counter">Punish Counter</label></div>
                <div><input onChange={() => {
                    setComboContext("counter");
                }} type="radio" id="counter" className={style["combo-context-radio"]} value="counter" name="combo-start" /><label className={style["combo-start"]} htmlFor="counter">Counter</label> </div>
                <div>
                    <input onChange={() => {
                    setComboContext("perfect-parry");
                }} className={style["combo-context-radio"]} type="radio" id="perfect-parry" value="perfect-parry" name="combo-start" />
                <label className={style["combo-start"]} htmlFor="perfect-parry">Perfect Parry</label></div>
                </div>
            </fieldset>
           
            <h3>Normals</h3>
            {Object.entries(x.normal).map(([moveInput, move]) => (
                <MoveButton onClick={addComboMove} key={moveInput} name={moveInput} type="normal" />
            ))}

            <h3>Target Combos</h3>
            {Object.entries(x["target-combo"]).map(([moveInput, move]) => (
                <MoveButton type="target-combo" onClick={addComboMove} key={moveInput} name={moveInput} />
            ))}

            <h3>Specials</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(x["special"]).map(([moveInput]) => (
                    <SpecialButton onClick={(input, strength) => {
                        addSpecialMove({
                            input,
                            version: strength,
                        });
                    }} key={moveInput} name={moveInput}/>
                ))}
            </div>

            <h3>Throws</h3>
            {Object.entries(x["throw"]).map(([moveInput, move]) => (
                <MoveButton type="throw" onClick={addComboMove} key={moveInput} name={moveInput} />
            ))}

            <h3>Supers</h3>
            {Object.entries({...x.super1, ...x.super2, ...x.super3 }).map(([moveInput, move]) => (
                <MoveButton type={move.type as Exclude<MoveType, "special">} name={moveInput} onClick={addComboMove} key={moveInput} />
            ))}

            <h3>Global Mechanics</h3>
            <DriveRushButton addMove={() => {
                setCombo((comboMoves) => [...comboMoves, {
                    type: "drive-rush",
                    input: "66",
                    id: shortid()
                }])
            }} />

            <div className={style["combo-area"]}>
                {comboMoves.map((move, index) => (
                    <>
                        <ComboMove {...move} index={index} key={move.id} onRemove={removeMove} />
                        {index !== comboMoves.length - 1 && <MoveCancelIndicator move={move} />}
                    </>
                ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                <button style={{ border: "1px solid white", borderRadius: 6, padding: 6 }} onClick={() => {
                    const combo = new Combo(Characters[character]);
                    const moveset = Movesets[character];
                    for (let move of comboMoves) {
                        const inputWithStrength = getInputWithStrength(move.input, move.type === "special" ? move.version : "overdrive");
                        const moveData = moveset[move.type][move.input];
                        const moveClass = new Move(move.type === "special" ? inputWithStrength : move.input, move.type, moveData.damage, move.type === "special" && move.version || "heavy");
                        moveClass.afterExecution = moveData.afterExecution;
                        combo.addMove(moveClass, move.cancelled);
                    }

                    const comboData = combo.getComboData({
                        perfectParry: comboContext === "perfect-parry",
                        isCounter: comboContext === "punish-counter"
                    });

                    setComboResult(comboData);
                }}>
                    Compute Combo
                </button>
            </div>
            <div>
                {!!comboResult.steps.length && (<>
                    {comboResult.steps.map((step, i) => {
                        const stepExplanation = explainStep({ step });
                        if (step.move === "66") {
                            return <div>Drive Rush {stepExplanation}</div>
                        }
                        return <div key={step.move + "-" + i}>{step.move} - {step.damage} {stepExplanation}</div>
                    })}
                    <p>Total Damage: {comboResult.totalDamage}</p>
                    </>
                )}
            </div>
        </>
    );
};

export default CharacterPage;
