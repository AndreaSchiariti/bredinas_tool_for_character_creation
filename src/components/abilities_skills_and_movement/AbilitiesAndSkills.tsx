import type { JSX } from "react";
import type { Ability } from "../../types/characterUtils.type";
import { AbilityBox } from "./AbilityBox";
import { SkillBox } from "./SkillBox";

export interface AbilitiesAndSkillProp {
  ability: Ability | "noAbility";
}

export function AbilitiesAndSkills({
  ability,
}: AbilitiesAndSkillProp): JSX.Element {
  return (
    <div className={`abilities-and-skills-container grid-area-${ability}`}>
      <AbilityBox ability={ability} />
      <SkillBox ability={ability} />
    </div>
  );
}
