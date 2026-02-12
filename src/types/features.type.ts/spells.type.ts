import type { TrackModifications } from "../trackModifications.types";

export interface SpellsSlot {
  level1: number;
  level2?: number;
  level3?: number;
  level4?: number;
  level5?: number;
  level6?: number;
  level7?: number;
  level8?: number;
  level9?: number;
}

export type SpellLevel = "cantrip" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SpellComponents {
  somatic: boolean;
  verbal: boolean;
  material: boolean;
}

export interface SpellInterface {
  name: string;
  school: string;
  level: SpellLevel;
}

export interface SpellList {
  level: SpellLevel;
  spellList: SpellInterface[];
}

export interface Spellcasting {
  cantripKnown?: number;
  spellsKnown?: number;
  spellList: SpellList[];
}

export interface CharacterSpellcasting extends Spellcasting {
  spellsSlot?: SpellsSlot;
  canCast: SpellComponents;
  isConcentration: boolean;
  trackModifications: TrackModifications[];
}
