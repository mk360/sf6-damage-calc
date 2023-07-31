import style from "./style.module.scss";

const available = ["Ryu"];

function CharacterSlot({
    name,
    setter
}: {
    name: string;
    setter: (s: string) => void;
}) {
    if (available.includes("Ryu")) {
        return <a onMouseEnter={() => {
            setter(name);
        }} href={`/characters/${name.toLowerCase().replace(/[\s.]+/g, "")}`} className={style["character-selector"]}>{name}</a>;
    }

    return <div className={style["character-selector"] + " " + style["wip"]}>{name}</div>;
};

export default CharacterSlot;
