"use client";

import { useState } from "react";
import { IComboMove, ISpecialMove } from "../../types/combo-move-interface";

function MoveCancelIndicator({ move }: { move: IComboMove | ISpecialMove }) {
    const [cancelled, setCancelled] = useState(false);

    return <svg>
        <line x1={0} x2={90} style={{ width: "100%"}} y1={0} y2={0} onClick={() => {
            setCancelled(!cancelled);
            move.cancelled = !cancelled;
        }} stroke={cancelled ? (move.type === "normal" ? "red" : move.type === "special" ? "blue" : "green") : "white"} strokeWidth={25} />
        <text fill="white" x="55"  y="60">{cancelled ? "Cancelled" : "Not cancelled"}</text>
    </svg>
};

export default MoveCancelIndicator;
