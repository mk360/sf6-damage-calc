import Character from "@/logic/character";
import RyuMoveset from "@/data/movesets/ryu";

const Ryu = new Character();
Ryu.consumables = {
    max: 1,
    name: "Denjin Charge"
};

Ryu.moveset = RyuMoveset;

export default Ryu;
