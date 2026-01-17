import { createContext, useContext } from "react";
import characterJson from "../mock-json/character_json.json";

import type { Character } from "../types/character";

export const CharacterContex = createContext<Character | undefined>(characterJson as Character)

export function useCharacterContext(): Character{
    const character = useContext(CharacterContex)

    if (character === undefined) {
        throw new Error("useCharacterContext must be used with a CharacterContext")
    }

    return character
}