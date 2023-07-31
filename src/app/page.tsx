"use client";

import { useState } from 'react'
import styles from "./style.module.scss";
import CharacterSlot from '@/components/character-slot';

const characterList = [
  ["", "Luke", "Jamie", ""],
  ["Manon", "Kimberly", "Marisa", "Lily"],
  ["JP", "Juri", "Dee Jay", "Cammy"],
  ["Ryu", "E. Honda", "Blanka", "Guile"],
  ["Ken", "Chun-Li", "Zangief", "Dhalsim"]
];

function createCharacterSelectors(setter: (s: string) => void) {
  return characterList.map((row, i) => (
    <div key={i} className={styles[`character-row-${i + 1}`]}>
      {row.map(character => {
        if (!character) return <div />;
        return <CharacterSlot key={character} setter={setter} name={character} />
      })}
    </div>
  ));
}

export default function Home() {
  const [character, setCharacter] = useState("");
  return (
      <div className={styles["main-grid"]}>
        <h4>Character Select</h4>
        {/* <div className={styles["character-portrait"]}>
          {character && (
            <img width="100%" height="100%" alt={character} lang='en' aria-labelledby={character} src={`/portraits/${character}.png`} />
          )}
        </div> */}
        <div className={styles["character-select"]}>
          {createCharacterSelectors(setCharacter)}
        </div>
      </div>
  )
}
