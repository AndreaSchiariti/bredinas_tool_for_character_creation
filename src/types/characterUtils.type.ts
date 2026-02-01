import type {
  Ability,
  DamageTypes,
  SavingThrow,
  Skill,
} from "../rules/arrayOfFeatures";
import type { ClassFeatureDescription } from "./characterClassesUtils.types";
import type { TrackModifications } from "./trackModifications.types";
import type { DiceInterface } from "./generalRules.types";
import type { ShieldInterface, WeaponInterface } from "./items.types";

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

export type SkillPropType = "skill" | "savingThrow" | "initiative";

export type SkillPropName = Skill | SavingThrow | "initiative";

export interface HitDiceProp {
  spent: number;
  max: number;
  diceType: HitDice;
}

export interface IsHealing {
  isShown: boolean;
  information: string | null;
}

export interface Hp {
  basicMax: number;
  currentMax: number;
  current: number;
  temp: number;
  isHealing: IsHealing;
  hitDices: HitDiceProp[];
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

export interface SkillBase {
  name: SkillPropName;
  type: SkillPropType;
  ability: Ability;
  baseScore: number;
  currentScore: number;
  hasExpertise: boolean;
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  trackModifications: TrackModifications[];
}

interface SkillProficiencyNoClass extends SkillBase {
  gainedWithClass: false;
  hasProficiency: boolean;
}

interface SkillProficiencyWithClass extends SkillBase {
  gainedWithClass: true;
  hasProficiency: true;
}

export type SkillProp = SkillProficiencyNoClass | SkillProficiencyWithClass;

export interface CharacterSpeed {
  baseScore: number;
  currentScore: number;
  trackModifications: TrackModifications[];
}

export interface CharacterArmorClass {
  baseScore: number;
  currentScore: number;
  abilities: Ability[];
  trackModifications: TrackModifications[];
  isWearingLightArmor: boolean;
  isWearingMediumArmor: boolean;
  isWearingHeavyArmor: boolean;
  isShieldEquipped: boolean;
}

export interface DamageTypeProp {
  type: DamageTypes;
  isResistant: boolean;
  isImmune: boolean;
  isVulnerable: boolean;
}

export interface TurnEconomyProp {
  name: string;
  id: string;
  description: ClassFeatureDescription[];
  source: string;
  isDescriptionVisible: boolean;
}

export interface CharacterTurnEconomy {
  actions: TurnEconomyProp[];
  bonusActions: TurnEconomyProp[];
  reactions: TurnEconomyProp[];
  freeActions: TurnEconomyProp[];
}

export interface CharacterUnarmedStrike {
  baseDice: DiceInterface | 1;
  currentDice: DiceInterface | 1;
  abilities: Ability[];
  defaultAbility: "strength";
  damageTypes: DamageTypes[];
  trackModifications: TrackModifications[];
}

export interface CharacterEquipment {
  mainHand: WeaponInterface | ShieldInterface | null;
  offHand: WeaponInterface | ShieldInterface | null;
}
