import type { ValueBasedOnLevel } from "../ModificationProps.type";
import type { TrackModifications } from "../trackModifications.types";
import type { Ability } from "./abilitiesAndSkills.type";
import type { CharacterClassesName } from "./classes.type";

export const schoolsOfMagic = [
  "abjuration, conjuration, divination, enchantment, evocation, illusion, necromancy, transmutation",
] as const;

export type SchoolsOfMagic = (typeof schoolsOfMagic)[number];

export const schoolsOfMagicSet = new Set<SchoolsOfMagic>(schoolsOfMagic);

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
  school: SchoolsOfMagic;
  level: SpellLevel;
  class: CharacterClassesName[];
  preferredAbility?: Ability;
}

export interface SpellLevelInterface {
  level: SpellLevel;
  spells: SpellInterface[];
}

export type isAddingSpell =
  | {
      isShown: false;
    }
  | {
      isShown: true;
      addedBy: string;
      school?: SchoolsOfMagic[];
    };

export interface SpellList {
  spellList: SpellLevelInterface[];
  isAddingSpell: isAddingSpell;
}

export interface Spellcasting {
  cantripKnown?: number;
  preparedSpells?: number;
  spellList: SpellList[];
  ability: Ability[];
  usedAbility: Ability;
}

export interface CharacterSpellcasting extends Spellcasting {
  spellsSlot?: SpellsSlot;
  canCast: SpellComponents;
  isConcentration: boolean;
  trackModifications: TrackModifications[];
}

export interface ClassSpellcasting extends Spellcasting {
  classSpellList: CharacterClassesName[];
  classLevelDivider?: 1 | 2 | 3;
  maxPactMagicSlots?: number;
  currentPactMagicSlots?: number;
  canCastLevel?: number;
}
