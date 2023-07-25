import MoveType from "@/logic/types/move-type";
import style from "./style.module.scss";
import MoveStrength from "@/app/types/move-strength";
import getInputWithStrength from "@/app/utils/get-input-with-strength";

function ComboMove({ type, input, index, onRemove, version }: { type: MoveType, input: string, version?: MoveStrength; index: number, onRemove: (index: number) => void }) {
    return <div className={style["combo-move"]} style={{ position: "relative" }}>{type === "special" && version ? getInputWithStrength(input, version) : input}
    <button onClick={() => {
        onRemove(index);
    }} style={{ position: "absolute", paddingBottom: 3, zIndex: 1, transform: "translate(-10%, -80%)", height: 25, width: 25, borderRadius: "50%", verticalAlign: "middle", textAlign: "center", backgroundColor: "blue" }}>&times;</button></div>
};

export default ComboMove;
