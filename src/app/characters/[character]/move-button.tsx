"use client";

import MoveType from "@/logic/types/move-type";
import style from "./style.module.scss";

function MoveButton({ name, onClick, type }: { name: string; type: MoveType; onClick: (move: { type: MoveType, input: string }) => void }) {
    return (
        <button onClick={() => {
            onClick({
                type,
                input: name
            });
        }} className={style.normal} style={{ padding: 8, borderRadius: 8 }}>
            {name}
        </button>
    )
};

export default MoveButton;
