import React, { useMemo, type JSX } from "react";
import { BoxWithTitle } from "../BowWithTitle";
import { useCharacterContext } from "../../context/CharacterContext";
import type { Character } from "../../backend/types/character.types/character.types";
import type { Hp } from "../../backend/types/character.types/characterUtils.type";

type HpKey = keyof Hp;

function checkChangedData(character: Character, data: HpKey): number {
  const dataToCheck = character.hp[data];

  if (typeof dataToCheck != "number") {
    throw new Error(`character.hp.${data} is not a number`);
  }

  return dataToCheck;
}

export function CharacterHitPoints(): JSX.Element {
  const character = useCharacterContext();

  const currentHp = useMemo<number>(
    () => checkChangedData(character, "current"),
    [character],
  );
  const currentMax = useMemo<number>(
    () => checkChangedData(character, "currentMax"),
    [character],
  );
  const temp = useMemo<number>(
    () => checkChangedData(character, "temp"),
    [character],
  );

  function calculateWidthBasedOnDamage(health: number): React.CSSProperties {
    return {
      width: `${(health / currentMax) * 100}%`,
      transition: "width 500ms linear",
    };
  }

  return (
    <div className="flex-v-center-between grid-area-hp">
      <BoxWithTitle title="hitPoints">
        <div className="hp-container">
          <h1>{`${currentHp} / ${currentMax}${
            temp > 0 ? ` + ${temp}` : ""
          }`}</h1>
          <div
            className={`health-bar ${
              currentHp <= currentMax / 2 ? "border-bright-red" : ""
            }`}
          >
            <div
              className="current-hp-left hp-left-bar"
              style={calculateWidthBasedOnDamage(currentHp)}
            ></div>
            <div
              className="current-hp-left temp-bar"
              style={calculateWidthBasedOnDamage(temp)}
            ></div>
          </div>
        </div>
      </BoxWithTitle>
    </div>
  );
}
