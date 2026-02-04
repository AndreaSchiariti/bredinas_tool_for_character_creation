import type {
  Ability,
  DamageTypes,
  FeatType,
  SavingThrow,
  Skill,
} from "../rules/arrayOfFeatures";
import type { ClassFeatureDescription } from "./characterClassesUtils.types";
import type { TrackModifications } from "./trackModifications.types";
import type { DiceInterface } from "./generalRules.types";
import type { ShieldInterface, WeaponInterface } from "./items.types";
import type { ModificationsProp } from "./ModificationProps.type";

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
  baseMaxLimit: number
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
  trackModifications: TrackModifications[];
}

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

export interface InfoForUser {
  message: string;
  property?: string;
}

export type CharacterMessage =
  | { isShown: false; message: null }
  | { isShown: true; message: InfoForUser };

export function isCharacterMessage(data: unknown): data is CharacterMessage {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const characterMessage = data as {
    isShown?: unknown;
    message?: unknown;
  };

  if (typeof characterMessage.isShown !== "boolean") {
    return false;
  }

  if (characterMessage.isShown === false) {
    return characterMessage.message === null;
  }

  if (
    characterMessage.message === null ||
    typeof characterMessage !== "object"
  ) {
    return false;
  }

  const message = characterMessage.message as {
    message?: unknown;
    property?: unknown;
  };

  return (
    typeof message.message === "string" &&
    (message.property === undefined || typeof message.property === "string")
  );
}
