export type Units = "meters" | "feet" | "squares";

type Ability =
  | "strength"
  | "dexterity"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

type Skill =
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

type ModificationTarget = Ability | Skill | "speed" | "initiative";

type ModificationOperation =
  | "add"
  | "subtract"
  | "set"
  | "max"
  | "advantage"
  | "disadvantage";

type DamageTypes =
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

interface TrackModifications {
  source: string;
  target: ModificationTarget;
  operation: ModificationOperation;
  value: number | null;
}

interface HitDice {
  numberOfDices: number;
  typeOfDice: string;
}

export interface Hp {
  basicMax: number;
  currentMax: number;
  current: number;
  temp: number;
  hitDices: HitDice[];
}

export interface AbilityProp {
  id: "str" | "dex" | "con" | "int" | "wis" | "cha";
  name: Ability;
  baseScore: number;
  currentScore: number;
  modifier: number;
  trackModifications: TrackModifications[];
  maxLimit: number;
}

export interface SkillProp {
  name: Skill;
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
}

export interface Initiative {
  baseScore: number;
  currentScore: number;
  ability: "dexterity";
  trackModifications: TrackModifications[];
}

export interface DamageTypeProp {
  type: DamageTypes;
  isResistant: boolean;
  isImmune: boolean;
}
