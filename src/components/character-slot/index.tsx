import style from "./style.module.scss";

function CharacterSlot({
    name,
    setter
}: {
    name: string;
    setter: (s: string) => void;
}) {
    return <a onMouseEnter={() => {
        setter(name);
    }} href={`/characters/${name.toLowerCase().replace(/[\s.]+/g, "")}`} className={style["character-selector"]}>{name}</a>
};

export default CharacterSlot;
