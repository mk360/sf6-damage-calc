"use client";

import Movesets from "@/data/movesets";
import MoveButton from "./move-button";
import style from "./style.module.scss";
import MoveType from "@/logic/types/move-type";
import SpecialButton from "./special-button";
import { useState } from "react";
import Combo from "@/logic/combo";
import * as Characters from "@/data/characters";
import shortid from "shortid";
import ComboMove from "./combo-move";

interface IComboMove {
    type: MoveType;
    input: string;
    id: string;
}

function CharacterPage({ params: { character } }: { params: { character: keyof typeof Characters } }) {

    const x = Movesets[character as keyof typeof Movesets];
    const [combo, setCombo] = useState<IComboMove[]>([]);
    const [comboContext, setComboContext] = useState("");
    const comboData = new Combo(Characters[character]);

    function addMove(move: Omit<IComboMove, "id">) {
        const moveCopy: IComboMove = {...move, id: shortid() };
        setCombo((combo) => [...combo, moveCopy]);
    }

    function removeMove(moveIndex: number) {
        const comboWithoutMove = combo.splice(moveIndex, 1);
        setCombo(comboWithoutMove);
    }

    return (
        <div>
            <fieldset>
                <legend>Combo Context</legend>
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
            </fieldset>
            <fieldset>
                <legend>Character Settings</legend>
                <div>
                    
                </div>
            </fieldset>
            <h3>Normals</h3>
            {Object.entries(x.normal).map(([moveInput, move]) => (
                <MoveButton onClick={addMove} key={moveInput} name={moveInput} type="normal" />
            ))}

            <h3>Target Combos</h3>
            {Object.entries(x["target-combo"]).map(([moveInput, move]) => (
                <MoveButton type="target-combo" onClick={addMove} key={moveInput} name={moveInput} />
            ))}

            <h3>Specials</h3>
            <div style={{ display: "flex", gap: 6 }}>
                {Object.entries(x["special"]).map(([moveInput, move]) => (
                    <SpecialButton onClick={(input, strength) => {
                        const attackButton = input[input.length - 1];
                        const newInput = input.replace(attackButton, (strength === "overdrive" ? attackButton : strength[0].toUpperCase()) + attackButton);
                        addMove({
                            type: "special",
                            input: newInput,
                        });
                    }} key={moveInput} name={moveInput}/>
                ))}
            </div>

            <h3>Throws</h3>
            {/* {Object.entries(x["throw"]).map(([moveInput, move]) => (
                <MoveButton onClick={addMoveToCombo} key={moveInput} name={moveInput} type={move.type} />
            ))} */}

            <h3>Global Mechanics</h3>
            <button>Drive Rush</button>
            <button>Drive Impact</button>

            <div className={style["combo-area"]}>
                
                {combo.map((move, index) => (
                    <>
                        <ComboMove {...move} index={index} key={move.id} onRemove={removeMove} />
                        {/* {index !== combo.length - 1 && <MoveCancelIndicator move={move} />} */}
                    </>
                ))}
            </div>
        </div>
    );
};

export default CharacterPage;
