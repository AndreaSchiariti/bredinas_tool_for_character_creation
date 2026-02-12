import type { ClassFeatureDescription } from "./characterClassesUtils.types";
import type { TrackModifications } from "./trackModifications.types";
import type { AttackType, DiceInterface } from "./generalRules.types";
import type { ShieldInterface, WeaponInterface } from "./items.types";
import type { Ability } from "./features.type.ts/abilitiesAndSkills.type";
import type { DamageTypes } from "./features.type.ts/damageTypes.type";
import type { CoreWeaponName } from "./features.type.ts/items.type";
import type { TargetInterface } from "./targets.types";

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
  value1 ?: number | string
  value2 ?: number | string
  counterToAddCount ?: TargetInterface
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
  abilities: Ability[];
  trackModifications: TrackModifications[];
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

export interface CharacterAttacks {
  name: string;
  id: string;
  type: AttackType;
  damageDice: DiceInterface[];
  baseDamageDice: DiceInterface | 1;
  ability: Ability[];
  abilityUsed: Ability;
  addProficiency: boolean;
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  addingValues: number;
  trackModifications: TrackModifications[];
}

export interface CharacterWeaponMastery {
  available: number;
  weapons: CoreWeaponName[];
  trackModifications: TrackModifications[];
}

export interface CharacterReminder {
  name: string;
  id: string;
  content: string;
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
