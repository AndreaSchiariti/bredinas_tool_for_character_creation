import type { JSX } from "react";
import { useUserPreferencesContext } from "../../context/UserPreferencesContext";

export function ToggleSkillsWithAbilities(): JSX.Element {
  const { skillsWithAbilities, onChangeSkillsWithAbilities } =
    useUserPreferencesContext();

  return (
    <div className="temp-toggle-skills-with-abilitites-container">
      <button
        className="temp-button"
        onClick={onChangeSkillsWithAbilities}
      >{`switch to ${
        skillsWithAbilities ? "Skills apart Abilities" : "Skills with Abilities"
      }`}</button>
    </div>
  );
}
