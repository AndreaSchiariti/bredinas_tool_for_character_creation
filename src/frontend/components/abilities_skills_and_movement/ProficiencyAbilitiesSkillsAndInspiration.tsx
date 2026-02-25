import { type JSX } from "react";
import { ProficencyBonusBox } from "./ProficiencyBonusBox";
import { HeroicInspirationBox } from "./HeroicInspirationBox";
import { AbilitiesAndSkills } from "./AbilitiesAndSkills";
import { ToggleSkillsWithAbilities } from "../temp/ToggleSkillsWithAbilitiesButton";
import { useUserPreferencesContext } from "../../context/UserPreferencesContext";
import { type Ability } from "../../../backend/types/character.types/characterUtils.type";
import { SkillsApartAbilities } from "./SkillsApartAbilities";

const abilitiesNamesArray: Ability[] = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export function ProficiencyAbilitiesSkillsAndInspiration(): JSX.Element {
  const { skillsWithAbilities } = useUserPreferencesContext();

  return (
    <div className="flex-v-center-between grid-area-proficiency-abilities-skills-and-inspiration gap-4">
      <ToggleSkillsWithAbilities />
      <div
        className={`proficiency-abilities-skills-and-inspiration-container ${
          skillsWithAbilities
            ? "skills-with-abilities-template"
            : "skills-apart-abilities-template"
        }`}
      >
        <ProficencyBonusBox />
        <HeroicInspirationBox />
        {skillsWithAbilities &&
          abilitiesNamesArray.map((ability) => (
            <AbilitiesAndSkills
              key={`ability-and-skills-${ability}`}
              ability={ability}
            />
          ))}
        {!skillsWithAbilities && (
          <SkillsApartAbilities abilityNamesArray={abilitiesNamesArray} />
        )}
      </div>
    </div>
  );
}
