import { useMemo, type JSX } from "react";
import type { AbilitiesAndSkillProp } from "./AbilitiesAndSkills";
import { useTranslation } from "react-i18next";
import { useCharacterContext } from "../../context/CharacterContext";
import { type AbilityProp } from "../../../backend/types/character.types/characterUtils.type";
import { AbilitySavingThrowAndClassDifficulty } from "./AbilitySavingThrowAndClassDifficulty";
import { useUserPreferencesContext } from "../../context/UserPreferencesContext";

export function AbilityBox({ ability }: AbilitiesAndSkillProp): JSX.Element {
  const { t } = useTranslation();
  const character = useCharacterContext();
  const { skillsWithAbilities } = useUserPreferencesContext();

  const characterAbility = useMemo<AbilityProp>(() => {
    const retrievedAbility = character.abilities.find(
      (pcAbility) => pcAbility.name === ability,
    );

    if (!retrievedAbility) {
      throw new Error("Character's Ability not found in the AbilityBox");
    }

    return retrievedAbility;
  }, [character]);

  return (
    <div
      className={`ability-box-container grid-area-${ability} ${skillsWithAbilities ? "ability-box-with-skills" : ""}`}
    >
      <div className="ability-score-container">
        <h1 className="title-of-box ability-title">
          {t(ability).toUpperCase()}
        </h1>
        <div className="ability-value-container modifier-value">
          <h1>{characterAbility.modifier}</h1>
          <p>{t("modifier").toUpperCase()}</p>
        </div>
        <div className="ability-value-container score-value">
          <h2>{characterAbility.currentScore}</h2>
          <p>{t("score").toUpperCase()}</p>
        </div>
      </div>
      <AbilitySavingThrowAndClassDifficulty
        characterAbility={characterAbility}
        info="savingThrow"
      />
      <AbilitySavingThrowAndClassDifficulty
        characterAbility={characterAbility}
        info="classDifficulty"
      />
    </div>
  );
}
