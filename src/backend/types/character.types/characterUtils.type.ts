
import type { TrackModifications } from "../modifications.types/trackModifications.types";

import type { Ability } from "../features.types/abilitiesAndSkills.type";
import type { DamageTypes } from "../features.types/damageTypes.type";
import type {
  CoreWeaponName,
  ShieldInterface,
  WeaponInterface,
} from "../features.types/items.type";
import type { TargetInterface } from "../targets.types/targets.types";
import type { DiceInterface } from "../generalRules.types/dice.types";
import type { ArmorTraining, ClassFeatureDescription } from "../ruleClass.types/ruleClassUtils.types";

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

export interface HitDiceProp {
  spent: number;
  max: number;
  diceType: HitDice;
}

export interface IsHealing {
  isShown: boolean;
  information: string | null;
  value1?: number | string;
  value2?: number | string;
  counterToAddCount?: TargetInterface;
}

export interface Hp {
  basicMax: number;
  currentMax: number;
  current: number;
  temp: number;
  isHealing: IsHealing;
  hitDices: HitDiceProp[];
}

export interface CharacterSpeed {
  baseScore: number;
  currentScore: number;
  trackModifications: TrackModifications[];
}

export interface CharacterArmorClass {
  baseScore: number;
  currentScore: number;
  ability: Ability[];
  trackModifications: TrackModifications[];
  proficient: ArmorTraining;
  isWearingLightArmor: boolean;
  isWearingMediumArmor: boolean;
  isWearingHeavyArmor: boolean;
  isShieldEquipped: boolean;
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
  ability: Ability[];
  defaultAbility: "strength";
  currentAbility: Ability;
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

export interface CharacterWeaponMastery {
  available: number;
  weapons: CoreWeaponName[];
  trackModifications: TrackModifications[];
}

export type CharacterBardicInspiration = {
  isDiceSelectorIsShown: boolean;
  dice?: DiceInterface;
  isShown?: boolean;
};

export interface CharacterReminder {
  name: string;
  id: string;
  content: string;
}

export type CharacterMessage =
  | { isShown: false; message: null }
  | { isShown: true; message: InfoForUser };

export interface MartialWeaponProficiencyInterface {
  ammunition: boolean;
  finesse: boolean;
  heavy: boolean;
  light: boolean;
  loading: boolean;
  range: boolean;
  reach: boolean;
  thrown: boolean;
  twoHanded: boolean;
  versatile: boolean;
}

export interface WeaponProficiencyInterface {
  simple: boolean;
  martial: MartialWeaponProficiencyInterface;
  trackModifications: TrackModifications[];
}

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
