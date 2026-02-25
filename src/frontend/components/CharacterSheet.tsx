import type { JSX } from "react";
import { CharacterInfo } from "./characterInfoAndDefence/CharacterInfo";
import { CharacterDefence } from "./characterInfoAndDefence/CharacterDefence";
import { InitiativeMovementAndSenses } from "./abilities_skills_and_movement/InitiativeMovementAndSenses";
import { ProficiencyAbilitiesSkillsAndInspiration } from "./abilities_skills_and_movement/ProficiencyAbilitiesSkillsAndInspiration";

export function CharacterSheet():JSX.Element {
    return <div className="character-sheet">
        <CharacterInfo />
        <CharacterDefence />
        <div className="medium-horizontal-line grid-area-divider-1 bg-color-text"></div>
        <InitiativeMovementAndSenses />
        <ProficiencyAbilitiesSkillsAndInspiration />
    </div>
}