import MoveType from "@/logic/types/move-type";
import style from "./style.module.scss";

function ComboMove({ type, input, index, onRemove }: { type: MoveType, input: string, index: number, onRemove: (index: number) => void }) {

    return <div className={style["combo-move"]} style={{ position: "relative" }}>{input}
    <button onClick={() => {
        onRemove(index);
    }} style={{ position: "absolute", paddingBottom: 3, zIndex: 1, transform: "translate(-10%, -80%)", height: 25, width: 25, borderRadius: "50%", verticalAlign: "middle", textAlign: "center", backgroundColor: "blue" }}>&times;</button></div>
};

export default ComboMove;
