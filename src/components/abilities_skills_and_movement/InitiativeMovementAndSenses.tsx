import { useMemo, type JSX } from "react";
import { useCharacterContext } from "../../context/CharacterContext";
import { InitiativeMovementAndSensesBox } from "./IniziativeMovementAndSensesBox";
import { type SkillProp } from "../../backend/types/character.types/characterUtils.type";
import { usePreferredUnit } from "../../frontend/custom_hooks/usePreferredUnit";

export function InitiativeMovementAndSenses(): JSX.Element {
  const character = useCharacterContext();

  const characterSpeed = usePreferredUnit(character.speed.currentScore);

  const characterInitiative = useMemo<SkillProp>(() => {
    const initiative = character.skills.find(
      (skill) => skill.type === "initiative",
    );

    if (!initiative) {
      throw new Error("Can't find Character's initiative");
    }

    return initiative;
  }, [character.skills]);

  return (
    <div className="initiative-movement-and-senses-container grid-area-initiative-movement-and-senses">
      <InitiativeMovementAndSensesBox
        info="initiative"
        infoValue={`${characterInitiative.currentScore}`}
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
