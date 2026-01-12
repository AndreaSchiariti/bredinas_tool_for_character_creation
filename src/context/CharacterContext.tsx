import { createContext, useContext } from "react";

import type { Character } from "../types/character";

export const CharacterContex = createContext<Character | undefined>(undefined)

export function useCharacterContext(){
    const character = useContext(CharacterContex)

    if (character === undefined) {
        throw new Error("useCharacterContext must be used with a CharacterContext")
    }

    return character
}