import type { JSX } from "react";
import { CharacterInfo } from "./CharacterInfo/CharacterInfo";

export function CharacterSheet():JSX.Element {
    return <div className="flex-v-center">
        <CharacterInfo/>
    </div>
}