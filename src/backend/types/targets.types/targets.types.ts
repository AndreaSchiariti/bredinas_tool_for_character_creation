import {
  
  type TrackModifications,
} from "../modifications.types/trackModifications.types";

import type { FeatureWithName } from "../modifications.types/ModificationProps.type";
import {
  type Ability,
  isAbility,
  type SkillProp,
  type AbilityProp,
} from "../features.types/abilitiesAndSkills.type";
import {
  type DamageTypes,
  isDamageType,
} from "../features.types/damageTypes.type";
import type { ConditionalTargetMap } from "../../rules/target/conditionalTargetResolver";
import type { DirectTargetMap } from "../../rules/target/directTargetResolver";
import type { DiceInterface } from "../generalRules.types/dice.types";
import { isDiceInterface } from "../guardingFunctions/generalFeaturesGuards";
import { isTrackModifications } from "../guardingFunctions/trackModificationsGuards";

interface MultiplyDiceCountTarget {
  type: "multiplyDiceCount";
  multiplier: number;
}

interface MultiplyValueTarget {
  type: "multiplyValue";
  multiplier: number;
}

export type ModifyTarget = MultiplyDiceCountTarget | MultiplyValueTarget;

interface TargetMod {
  targetMod?: ModifyTarget[];
}

export interface DirectTargetInterface extends TargetMod {
  target: keyof DirectTargetMap;
  type: "direct";
}

export interface ConditionalTargetInterface<
  K extends keyof ConditionalTargetMap = keyof ConditionalTargetMap,
> extends TargetMod {
  target: K;
  condition: ConditionalTargetMap[K]["condition"];
  type: "conditional";
}

export type TargetKeys = keyof DirectTargetMap | keyof ConditionalTargetMap;

export type TargetInterface =
  | DirectTargetInterface
  | ConditionalTargetInterface;

export type ConditionalValues =
  ConditionalTargetMap[keyof ConditionalTargetMap]["value"];

export type DirectValues = DirectTargetMap[keyof DirectTargetMap];

export type AllTargetValues = ConditionalValues | DirectValues;

export type TargetMap = DirectTargetMap | ConditionalTargetMap;

export type DiceInterfaceOrNumber = DiceInterface | number;

export function hasOnlyNumbers(array: unknown[]): array is number[] {
  return array.every((element) => typeof element === "number");
}

export function hasDiceInterfaceAndNumbers(
  array: unknown[],
): array is DiceInterfaceOrNumber[] {
  return array.every(
    (element) => typeof element === "number" || isDiceInterface(element),
  );
}

export type HasDamageTypes = Extract<
  AllTargetValues,
  { damageTypes: DamageTypes[] }
>;

export function hasDamageTypesProperty(
  object: AllTargetValues,
): object is HasDamageTypes {
  if (typeof object !== "object" || object === null) {
    return false;
  }

  const damage = object as { damageTypes?: unknown };

  return (
    Array.isArray(damage.damageTypes) && damage.damageTypes.every(isDamageType)
  );
}

export type HasCurrentAndBaseDiceWithTracking = Extract<
  AllTargetValues,
  {
    currentDice: DiceInterface | number;
    baseDice: DiceInterface | number;
    trackModifications: TrackModifications[];
  }
>;

export function hasDicesAndTrackingProperty(
  object: unknown,
): object is HasCurrentAndBaseDiceWithTracking {
  if (typeof object !== "object" || object === null) {
    return false;
  }

  const diceTarget = object as {
    baseDice?: unknown;
    currentDice?: unknown;
    trackModifications?: unknown;
  };

  const hasBaseDice =
    diceTarget.baseDice === "number" || isDiceInterface(diceTarget.baseDice);

  const hasCurrentDice =
    diceTarget.currentDice === "number" ||
    isDiceInterface(diceTarget.currentDice);

  const hasTrackModifications =
    Array.isArray(diceTarget.trackModifications) &&
    diceTarget.trackModifications.every(isTrackModifications);

  return hasBaseDice && hasCurrentDice && hasTrackModifications;
}

export type HasSingleAbilityWithTracking = Extract<
  AllTargetValues,
  { ability: Ability; trackModifications: TrackModifications[] }
>;

export function hasSingleAbilityWithTrackingProperty(
  object: unknown,
): object is HasSingleAbilityWithTracking {
  if (object === null || typeof object !== "object") {
    return false;
  }

  const abilityTarget = object as {
    ability?: unknown;
    trackModifications?: unknown;
  };

  const hasAbility =
    typeof abilityTarget.ability === "string" &&
    isAbility(abilityTarget.ability);

  const hasTrackModifications =
    Array.isArray(abilityTarget.trackModifications) &&
    abilityTarget.trackModifications.every(isTrackModifications);

  return hasAbility && hasTrackModifications;
}

export type HasAbilitiesWithTracking = Extract<
  AllTargetValues,
  { ability: Ability[]; trackModifications: TrackModifications[] }
>;

export function hasAbilitiesWithTrackingProperty(
  object: unknown,
): object is HasAbilitiesWithTracking {
  if (object === null || typeof object !== "object") {
    return false;
  }

  const abilitiesTarget = object as {
    abilities?: unknown;
    trackModifications?: unknown;
  };

  const hasAbilities =
    Array.isArray(abilitiesTarget.abilities) &&
    abilitiesTarget.abilities.every(
      (ability) => typeof ability === "string" && isAbility(ability),
    );

  const hasTrackModifications =
    Array.isArray(abilitiesTarget.trackModifications) &&
    abilitiesTarget.trackModifications.every(isTrackModifications);

  return hasAbilities && hasTrackModifications;
}

interface ScoreWithTracking {
  baseScore: number;
  currentScore: number;
  trackModifications: TrackModifications[];
}

export type HasScoresWithTracking = Extract<AllTargetValues, ScoreWithTracking>;

export function hasScoresWithTrackingProperty(
  object: unknown,
): object is HasScoresWithTracking {
  if (typeof object !== "object" || object === null) {
    return false;
  }

  const scoreTarget = object as {
    baseScore?: unknown;
    currentScore?: unknown;
    trackModifications?: unknown;
  };

  const hasBaseScore = typeof scoreTarget.baseScore === "number";

  const hasCurrentScore = typeof scoreTarget.currentScore === "number";

  const hasTrackModifications =
    Array.isArray(scoreTarget.trackModifications) &&
    scoreTarget.trackModifications.every(isTrackModifications);

  return hasBaseScore && hasCurrentScore && hasTrackModifications;
}

export interface ScoreWithTrackingAndName extends ScoreWithTracking {
  name: FeatureWithName;
}

export type TargetWithName = SkillProp[] | AbilityProp[];

export function hasScoresWithTrackingAndNameProperty(
  data: unknown,
): data is HasScoresWithTracking {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const scoreTarget = data as {
    name?: unknown;
    baseScore?: unknown;
    currentScore?: unknown;
    trackModifications?: unknown;
  };

  const hasName = typeof scoreTarget.name === "string";

  const hasBaseScore = typeof scoreTarget.baseScore === "number";

  const hasCurrentScore = typeof scoreTarget.currentScore === "number";

  const hasTrackModifications =
    Array.isArray(scoreTarget.trackModifications) &&
    scoreTarget.trackModifications.every(isTrackModifications);

  return hasName && hasBaseScore && hasCurrentScore && hasTrackModifications;
}

export function isArrayofScoresWithTrackingAndNameProperty(
  data: unknown,
): data is TargetWithName {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(hasScoresWithTrackingAndNameProperty);
}
