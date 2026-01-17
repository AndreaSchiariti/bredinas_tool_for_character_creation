export type Units = "meters" | "feet" | "squares";

export type UnitsAbbreviations = "m" | "ft" | "sq";

export type HitDice = "d6" | "d8" | "d10" | "d12";

export type Sizes =
  | "tiny"
  | "small"
  | "medium"
  | "large"
  | "huge"
  | "gargantuan";

export type Ability =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type Skill =
  | "acrobatics"
  | "animalHandling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleightOfHand"
  | "stealth"
  | "survival";

export type SavingThrow =
  | "strengthSavingThrow"
  | "dexteritySavingThrow"
  | "constitutionSavingThrow"
  | "intelligenceSavingThrow"
  | "wisdomSavingThrow"
  | "charismaSavingThrow";

export type SkillPropType = "skill" | "savingThrow";

export type ModificationTarget = Ability | Skill | "speed" | "initiative";

export type ModificationOperation =
  | "add"
  | "subtract"
  | "set"
  | "max"
  | "advantage"
  | "disadvantage";

export type DamageTypes =
  | "acid"
  | "cold"
  | "fire"
  | "force"
  | "lightning"
  | "necrotic"
  | "poison"
  | "psychic"
  | "radiant"
  | "thunder"
  | "bludgeoning"
  | "nonMagicalBludgeoning"
  | "piercing"
  | "nonMagicalPiercing"
  | "slashing"
  | "nonMagicalSlashing";

export interface TrackModifications {
  source: string;
  target: ModificationTarget;
  operation: ModificationOperation;
  value: number | null;
}

export interface HitDiceProp {
  spent: number;
  max: number;
  diceType: HitDice;
}

export interface Hp {
  basicMax: number;
  currentMax: number;
  current: number;
  temp: number;
  hitDices: HitDiceProp[];
}

export interface Initiative {
  ability: "dexterity";
  baseScore: number;
  currentScore: number;
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  trackModifications: TrackModifications[];
}

export interface AbilityProp {
  id: "str" | "dex" | "con" | "int" | "wis" | "cha";
  name: Ability;
  baseScore: number;
  currentScore: number;
  modifier: number;
  trackModifications: TrackModifications[];
  maxLimit: number;
  difficultyClass: number;
}

export interface SkillProp {
  name: Skill | SavingThrow;
  type: SkillPropType;
  ability: Ability;
  baseScore: number;
  currentScore: number;
  hasProficiency: boolean;
  hasExpertise: boolean;
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  trackModifications: TrackModifications[];
}

export interface CharacterSpeed {
  unit: Units;
  baseScore: number;
  currentScore: number;
  trackModifications: TrackModifications[];
}

export interface ArmorClass {
  baseScore: number;
  currentScore: number;
  trackModifications: TrackModifications[];
  isWearingLightArmor: boolean;
  isWearingMediumArmor: boolean;
  isWearingHeavyArmor: boolean;
}

export interface DamageTypeProp {
  type: DamageTypes;
  isResistant: boolean;
  isImmune: boolean;
  isVulnerable: boolean;
}
