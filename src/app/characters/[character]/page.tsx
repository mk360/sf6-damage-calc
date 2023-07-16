"use client";

import Movesets from "@/data/movesets";
import MoveButton from "./move-button";
import style from "./style.module.scss";
import Combo from "@/logic/combo";
import { ryu } from "@/data/characters";
import Move from "@/logic/move";
import MoveType from "@/logic/types/move-type";
import SpecialButton from "./special-button";

function CharacterPage({ params: { character } }: { params: { character: string } }) {
    const x = Movesets[character as keyof typeof Movesets];
    const combo = new Combo(ryu);
    console.log(combo);

    function addMoveToCombo(type: MoveType, moveInput: string, moveStrength?: "light" | "medium" | "heavy" | "overdrive") {
        const isSuper = type === "super1" || type === "super2" || type === "super3";
        const moveData = x[isSuper ? "super" : type][moveInput];
        const move = new Move(moveInput, type, moveData.damage, moveStrength);
        combo.addMove(move, false);
        console.log(combo);
    }

    return (
        <div>
            <fieldset>
                <legend>Combo Context</legend>
                <div><input type="radio" name="combo-start" /> Regular Combo</div>
                <div><input type="radio" name="combo-start" /> Punish Counter</div>
                <div><input type="radio" name="combo-start" /> Counter</div>
                <div><input type="radio" name="combo-start" /> Perfect Parry</div>
            </fieldset>
            <h3>Normals</h3>
            {Object.entries(x.normal).map(([moveInput, move]) => (
                <MoveButton onClick={addMoveToCombo} key={moveInput} name={moveInput} type={move.type} />
            ))}

            <h3>Target Combos</h3>
            {Object.entries(x["target-combo"]).map(([moveInput, move]) => (
                <MoveButton onClick={addMoveToCombo} key={moveInput} name={moveInput} type={move.type} />
            ))}

            <h3>Specials</h3>
            <div style={{ display: "flex", gap: 6 }}>
                {Object.entries(x["special"]).map(([moveInput, move]) => (
                    <SpecialButton onClick={addMoveToCombo} key={moveInput} name={moveInput}/>
                ))}
            </div>

            <h3>Throws</h3>
            {Object.entries(x["throw"]).map(([moveInput, move]) => (
                <MoveButton onClick={addMoveToCombo} key={moveInput} name={moveInput} type={move.type} />
            ))}

            <h3>Global Mechanics</h3>
            <button>Drive Rush</button>
            <button>Drive Impact</button>

            <div className={style["combo-area"]}>

            </div>
        </div>
    );
};

export default CharacterPage;
