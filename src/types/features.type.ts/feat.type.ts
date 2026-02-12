import type { ModificationsProp } from "../ModificationProps.type";

export const featTypes = [
  "origin",
  "fightingStyle",
  "general",
  "epicBoon",
] as const;

export type FeatType = (typeof featTypes)[number];

export interface Feat {
  name: string;
  description: string;
  modifications: ModificationsProp[];
  addedBy: string;
}

export type IsAddingFeats =
  | {
      isShown: false;
      addedBy: null;
    }
  | {
      isShown: true;
      addedBy: string;
      type?: FeatType;
    };

export interface CharacterFeats {
  feats: Feat[];
  isAddingFeats: IsAddingFeats;
}
