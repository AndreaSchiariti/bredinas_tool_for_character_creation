import type { ValueBasedOnLevel } from "../modifications.types/ModificationProps.type";
import type { TrackModifications } from "../modifications.types/trackModifications.types";
import type { Ability } from "./abilitiesAndSkills.type";
import type { CharacterClassesName, SpellcastingClassesName } from "./classes";

export const schoolsOfMagic = [
  "abjuration",
  "conjuration",
  "divination",
  "enchantment",
  "evocation",
  "illusion",
  "necromancy",
  "transmutation",
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

export interface SpellInterfaceBase {
  name: string;
  school: SchoolsOfMagic;
  level: SpellLevel;
  class: CharacterClassesName[];
  preferredAbility?: Ability;
  trackModifications: TrackModifications[];
}

export interface SpellInterfacePrepared extends SpellInterfaceBase {
  isPrepared: boolean;
  isAlwaysPrepared: false;
}

export interface SpellInterfaceAlwaysPrepared extends SpellInterfaceBase {
  isPrepared: false;
  isAlwaysPrepared: true;
}

export type SpellInterface =
  | SpellInterfacePrepared
  | SpellInterfaceAlwaysPrepared;

export interface SpellLevelInterface {
  level: SpellLevel;
  spells: SpellInterface[];
}

export interface Spellcasting {
  spellList: SpellLevelInterface[];
  ability: Ability[];
  usedAbility: Ability | null;
  addingSpellAttackValue: number;
  addingSaveDCValue: number;
  trackModifications: TrackModifications[];
}

export interface CharacterSpellcasting extends Spellcasting {
  cantripKnown?: number;
  spellsSlot?: SpellsSlot;
  canCast: SpellComponents;
  isConcentration: boolean;
  exchange: ExchangableFeatureWithSpellSlot[];
}

export type ExchangableFeatureWithSpellSlot = "bardicInspiration";

export interface ClassSpellcasting extends Spellcasting {
  preparedSpells: ValueBasedOnLevel;
  cantripKnown: ValueBasedOnLevel;
  classSpellList: SpellcastingClassesName[];
  classLevelDivider?: 1 | 2 | 3 | null;
  maxPactMagicSlots?: number;
  currentPactMagicSlots?: number;
  canCastLevel?: number;
  bonusCantripKnown?: number;
}

export interface SpellNameAndLevel {
  name: string;
  level: SpellLevel;
}
