import type { JSX } from "react";
import { BoxWithTitle } from "../BowWithTitle";
import { useCharacterContext } from "../../context/CharacterContext";

export function CharacterArmorClass ():JSX.Element {
    const character = useCharacterContext()

    return (
      <div className="grid-area-ac">
        <BoxWithTitle title="armorClass">
          <h2 className="armor-class">{character.armorClass.currentScore}</h2>
        </BoxWithTitle>
      </div>
    );
}