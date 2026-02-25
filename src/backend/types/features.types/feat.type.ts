import type { ModificationsProp } from "../modifications.types/ModificationProps.type";

export const featTypes = [
  "origin",
  "fightingStyle",
  "general",
  "epicBoon",
] as const;

export type FeatType = (typeof featTypes)[number];

type CustomFeatName = string & { _customFeatName: true };

export const ruleFeatName = [
  "alert",
  "magicInitiate",
  "savageAttacker",
  "skilled",
  "abilityScoreImprovement",
  "grappler",
  "archery",
  "defense",
  "greatWeaponFighting",
  "twoWeaponFighting",
  "boonOfCombatProwess",
  "boonOfDimensionalTravel",
  "boonOfFate",
  "boonOfIrresistibleOffense",
  "boonOfSpellRecall",
  "boonOfTheNightSpirit",
  "boonOfTruesight",
] as const;

type RuleFeatName = (typeof ruleFeatName)[number];

export type FeatName = RuleFeatName | CustomFeatName;

export interface Feat {
  name: FeatName;
  type: FeatType;
  description: string;
  modifications: ModificationsProp[];
  addedBy: string;
}
