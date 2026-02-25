import type { JSX } from "react";
import { BoxWithTitle } from "../BowWithTitle";
import { useCharacterContext } from "../../context/CharacterContext";
import { HitDiceType } from "./HitDiceType";

export function CharacterHitDice(): JSX.Element {
  const character = useCharacterContext();

  return (
    <div className="grid-area-hit-dice">
      <BoxWithTitle title="hitDice">
        <div className="hit-dice-container">
          {character.hp.hitDices.map((dice) => (
            <HitDiceType
              key={dice.diceType}
              spent={dice.spent}
              max={dice.max}
              diceType={`${dice.diceType}`}
            />
          ))}
        </div>
      </BoxWithTitle>
    </div>
  );
}
