import { createContext, useContext } from "react";
import characterJson from "../mock-json/mockCharacter.json";

import type { Character } from "../backend/types/character.types";

export const CharacterContex = createContext<Character | undefined>(
  characterJson as Character,
);

export function useCharacterContext(): Character {
  const character = useContext(CharacterContex);

  if (character === undefined) {
    throw new Error("useCharacterContext must be used with a CharacterContext");
  }

  return character;
}
