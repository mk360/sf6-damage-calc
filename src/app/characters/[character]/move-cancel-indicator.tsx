"use client";

import { useState } from "react";
import { IComboMove, ISpecialMove } from "../../../types/combo-move-interface";

function MoveCancelIndicator({ move }: { move: IComboMove | ISpecialMove }) {
    const [cancelled, setCancelled] = useState(false);

    return <svg style={{ width: 180 }}>
        <line x1={0} x2={180} y1={20} y2={20} onClick={() => {
            setCancelled(!cancelled);
            move.cancelled = !cancelled;
        }} stroke={cancelled ? (move.type === "normal" ? "red" : move.type === "special" ? "blue" : "green") : "white"} strokeWidth={12} />
        <text fill="white" x="25"  y="60">{cancelled ? "Cancelled" : "Not cancelled"}</text>
    </svg>
};

export default MoveCancelIndicator;
