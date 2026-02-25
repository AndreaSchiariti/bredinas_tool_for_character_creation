import { useMemo, type JSX } from "react";
import type { AbilitiesAndSkillProp } from "./AbilitiesAndSkills";
import { useCharacterContext } from "../../context/CharacterContext";
import { type SkillProp } from "../../backend/types/character.types/characterUtils.type";
import { SingleSkill } from "./SingleSkill";
import { useUserPreferencesContext } from "../../context/UserPreferencesContext";
import { useSortArrayByLanguage } from "../../frontend/custom_hooks/useSortByLanguage";
import { useTranslation } from "react-i18next";

export function SkillBox({ ability }: AbilitiesAndSkillProp): JSX.Element {
  const character = useCharacterContext();
  const { skillsWithAbilities } = useUserPreferencesContext();
  const { sortArrayOfObjects } = useSortArrayByLanguage<SkillProp>();
  const { i18n } = useTranslation();

  const skillsArray = useMemo<SkillProp[]>(() => {
    let abilitySkills: SkillProp[] = [];

    if (skillsWithAbilities) {
      abilitySkills = character.skills.filter(
        (skill) => skill.ability === ability && skill.type === "skill",
      );
    } else {
      abilitySkills = character.skills.filter(
        (skill) => skill.type === "skill",
      );
    }

    if (!abilitySkills) {
      throw new Error(`Couldn't retrieve the ${ability}'s skills`);
    }

    return sortArrayOfObjects(abilitySkills, "name");
  }, [character, skillsWithAbilities, ability, i18n.language]);

  return (
    <div
      className={`skill-box-container ${
        skillsArray.length === 0 ? "no-border" : ""
      } ${
        skillsWithAbilities ? "skill-box-with-abilities" : "grid-area-skills"
      }`}
    >
      {skillsArray.map((skill) => (
        <SingleSkill key={`${skill.name}Score`} skill={skill} />
      ))}
    </div>
  );
}
