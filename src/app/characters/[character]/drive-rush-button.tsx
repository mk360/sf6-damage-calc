import style from "./style.module.scss";

function DriveRushButton({ addMove }: { addMove: (input: "66") => void }) {
    return <button onClick={() => {
        addMove("66");
    }} className={style["drive-rush"]}>
        Drive Rush
    </button>
};

export default DriveRushButton;
