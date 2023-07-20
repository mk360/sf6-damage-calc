import style from "./style.module.scss";

function SpecialButton({ name, onClick }: { name: string; onClick: (input: string, strength: "light" | "medium" | "heavy" | "overdrive") => void }) {
    return (
        <div className={style["special"]} style={{ padding: 8, borderRadius: 8 }}>
            <div>{name}</div>
            <div><button onClick={() => {
                onClick(name, "light");
            }}>Light</button> <button onClick={() => {
                onClick(name, "medium");
            }}>Medium</button> <button onClick={() => {
                onClick(name, "heavy");
            }}>Heavy</button> <button onClick={() => {
                onClick(name, "overdrive");
            }}>Overdrive</button></div>
        </div>
    )
};

export default SpecialButton;
