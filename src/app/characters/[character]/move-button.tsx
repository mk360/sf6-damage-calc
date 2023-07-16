"use client";

import MoveType from "@/logic/types/move-type";
import style from "./style.module.scss";

function MoveButton({ type, name, onClick }: { type: MoveType, name: string; onClick: (type: MoveType, input: string) => void }) {
    return (
        <button onClick={() => {
            onClick(type, name);
        }} className={style[type]} style={{ padding: 8, borderRadius: 8 }}>
            {name}
        </button>
    )
};

export default MoveButton;
