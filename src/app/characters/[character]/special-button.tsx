import MoveType from "@/logic/types/move-type";
import style from "./style.module.scss";

function SpecialButton({ name, onClick }: { name: string; onClick: (type: MoveType, input: string, moveStrength?: "light" | "medium" | "heavy" | "overdrive") => void }) {
    return (
        <div className={style["special"]} style={{ padding: 8, borderRadius: 8 }}>
            <div>{name}</div>
            <div><button onClick={() => {
                onClick("special", name, "light");
            }}>Light</button> <button onClick={() => {
                onClick("special", name, "medium");
            }}>Medium</button> <button onClick={() => {
                onClick("special", name, "heavy");
            }}>Heavy</button> <button onClick={() => {
                onClick("special", name, "overdrive");
            }}>Overdrive</button></div>
        </div>
    )
};

export default SpecialButton;
