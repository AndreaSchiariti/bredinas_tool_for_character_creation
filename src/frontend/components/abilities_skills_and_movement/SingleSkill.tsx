import type { JSX } from "react";
import type { SkillProp } from "../../../backend/types/character.types/characterUtils.type";
import { useTranslation } from "react-i18next";
import { useUserPreferencesContext } from "../../context/UserPreferencesContext";

export function SingleSkill({ skill }: { skill: SkillProp }): JSX.Element {
  const { t } = useTranslation();
  const { skillsWithAbilities } = useUserPreferencesContext();

  return (
    <div
      className={`single-skill-container ${
        !skillsWithAbilities ? "skills-apart-abilities-single-skill" : ""
      }`}
    >
      <div className="skill-proficiency-container">
        <div
          className={`proficiency-circle proficiency-check ${
            skill.hasProficiency ? "is-proficient" : ""
          }`}
        />
        <div
          className={`proficiency-circle expertise-check ${
            skill.hasExpertise ? "is-proficient" : ""
          }`}
        />
      </div>
      <h2>{skill.currentScore}</h2>
      {!skillsWithAbilities && <p>{t(skill.ability)}</p>}
      <p>{t(skill.name)}</p>
    </div>
  );
}
