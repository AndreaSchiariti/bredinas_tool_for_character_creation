import { useMemo, type JSX } from "react";
import { useCharacterContext } from "../../context/CharacterContext";
import { InitiativeMovementAndSensesBox } from "./IniziativeMovementAndSensesBox";
import { useUserPreferencesContext } from "../../context/UserPreferencesContext";
import { type CharacterSpeed, type UnitsAbbreviations } from "../../types/character_utils";
import { useTranslation } from "react-i18next";

export function InitiativeMovementAndSenses(): JSX.Element {
  const character = useCharacterContext();
  const { preferredUnit } = useUserPreferencesContext();
  const {t} = useTranslation()

  const characterSpeed = useMemo<string>(() => {
    const newSpeedUnit: CharacterSpeed | undefined = character.speed.find(
      (speed) => speed.unit === preferredUnit
    );

    if (newSpeedUnit === undefined) {
      throw new Error("There is a problem when switching the units");
    }

    let unitAbbreviation : UnitsAbbreviations= "ft"

    switch (newSpeedUnit.unit) {
        case "feet":
            unitAbbreviation = "ft"
            break ;
        case "meters":
            unitAbbreviation = "m"
            break ;
        case "squares":
            unitAbbreviation = "sq"
            break;
        default:
            throw new Error("character.speed.unit doesn't match any unit")
    }

    return `${newSpeedUnit.currentScore} ${t(unitAbbreviation)}`;
  }, [preferredUnit, character.speed]);

  return (
    <div className="initiative-movement-and-senses-container grid-area-initiative-movement-and-senses">
      <InitiativeMovementAndSensesBox
        info="initiative"
        infoValue={`${character.initiative.currentScore}`}
        gridArea="initiative"
      />
      <InitiativeMovementAndSensesBox
        info="speed"
        infoValue={`${characterSpeed} `}
        gridArea="movement"
      />
      <InitiativeMovementAndSensesBox
        info="size"
        infoValue={`${character.size}`}
        gridArea="character-size"
      />
      <InitiativeMovementAndSensesBox
        info="passivePerception"
        infoValue={`${character.passivePerception}`}
        gridArea="passive-perception"
      />
    </div>
  );
}
