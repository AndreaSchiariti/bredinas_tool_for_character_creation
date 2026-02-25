import type { JSX } from "react";
import { BoxWithTitle } from "../BowWithTitle";
import { useCharacterContext } from "../../context/CharacterContext";

export function ProficencyBonusBox (): JSX.Element {
    const character = useCharacterContext()

    return <div className="proficiency-bonus-container grid-area-proficiencyBonus">
        <BoxWithTitle title="proficiencyBonus">
            <div className="flex-v-center-between w-100-perc">
                <div className="very-small-horizontal-line bg-color-text" />
                <h1 className="proficiency-value-container">{character.proficiency}</h1>
            </div>
        </BoxWithTitle>
    </div>
}