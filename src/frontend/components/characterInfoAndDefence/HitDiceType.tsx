import type { JSX } from "react";
import type { HitDiceProp } from "../../../backend/types/character.types/characterUtils.type";
import { CharacterSingleInfo } from "./CharacterSingleInfo";

export function HitDiceType({
  spent,
  max,
  diceType,
}: HitDiceProp): JSX.Element {
  return (
    <div className="hit-dice-details">
      <CharacterSingleInfo
        characterInfo={`${spent}`}
        whichInfo="spent"
        flexAlign="start"
        className="hit-dice"
      />
      <div className="very-small-vertical-line bg-color-text"></div>
      <CharacterSingleInfo
        characterInfo={`${max}${diceType}`}
        whichInfo="max"
        flexAlign="start"
        className="hit-dice"
      />
    </div>
  );
}
