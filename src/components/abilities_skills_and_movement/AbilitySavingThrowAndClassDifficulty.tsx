import { useMemo, type JSX } from "react";
import type {
  AbilityProp,
  SkillProp,
} from "../../backend/types/character.types/characterUtils.type";
import { useCharacterContext } from "../../context/CharacterContext";
import { useTranslation } from "react-i18next";

interface AbilityTSAndCSType {
  characterAbility: AbilityProp;
  info: "savingThrow" | "classDifficulty";
}

export function AbilitySavingThrowAndClassDifficulty({
  characterAbility,
  info,
}: AbilityTSAndCSType): JSX.Element {
  const character = useCharacterContext();
  const { t } = useTranslation();

  const characterSavingThrow = useMemo<SkillProp>(() => {
    const retrievedSavingThrow = character.skills.find(
      (pcSavingThrow) =>
        pcSavingThrow.name === `${characterAbility.name}SavingThrow`,
    );

    if (!retrievedSavingThrow) {
      throw new Error("Can't find character Saving Throw values");
    }

    return retrievedSavingThrow;
  }, [character]);

  return (
    <div className="ability-saving-throw-and-class-difficulty-container">
      {info === "savingThrow" && (
        <div
          className={`proficiency-circle ${
            characterSavingThrow.hasProficiency ? "is-proficient" : ""
          }`}
        ></div>
      )}
      <h2>
        {info === "savingThrow"
          ? characterSavingThrow.currentScore
          : characterAbility.difficultyClass}
      </h2>
      <div className="very-small-vertical-line bg-color-text" />
      <h3>{t(info).toUpperCase()}</h3>
    </div>
  );
}
