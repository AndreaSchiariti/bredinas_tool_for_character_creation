import type { JSX } from "react";
import type { Ability } from "../../types/character_utils";
import { AbilityBox } from "./AbilityBox";
import { SkillBox } from "./SkillBox";

export function SkillsApartAbilities({
  abilityNamesArray,
}: {
  abilityNamesArray: Ability[];
}): JSX.Element {
  return (
    <>
      {abilityNamesArray.map((ability) => (
        <AbilityBox key={`skillsApart${ability}`} ability={ability} />
      ))}
      <SkillBox ability="noAbility" />
    </>
  );
}
