import type { Ability } from "./features.type.ts/abilitiesAndSkills.type";
import type { DamageTypes } from "./features.type.ts/damageTypes.type";
import type {
  ConditionalTargetInterface,
  TargetInterface,
} from "./targets.types";

interface BaseConditionEvent {
  target: TargetInterface[];
  activeConditionRef: ConditionalTargetInterface;
}

interface AddResistanceConditionEvent extends BaseConditionEvent {
  type: "addResistanceConditionEvent";
  addResistancesTo: DamageTypes[];
}

interface AddValueToAttacksBasedOnAbilityBase extends BaseConditionEvent {
  type: "addValueToAttacksBasedOnAbilityConditionEvent";
  ability: Ability[];
}

interface AddValueToAttacksBasedOnAbilityWithTracker extends AddValueToAttacksBasedOnAbilityBase {
  valueToFetch: TargetInterface;
}

interface AddValueToAttacksBasedOnAbilityWithoutTracker extends AddValueToAttacksBasedOnAbilityBase {
  value: number;
}

type addValueToAttacksBasedOnAbilityConditionEvent =
  | AddValueToAttacksBasedOnAbilityWithTracker
  | AddValueToAttacksBasedOnAbilityWithoutTracker;

interface StopConcentrationAndSpellcastingConditionEvent extends BaseConditionEvent {
  type: "stopConcentrationAndSpellcastingConditionEvent";
}

interface AddBardicInspirationDice extends BaseConditionEvent {
  type: "addBardicInspirationDice";
}

export type ConditionEventProp =
  | AddResistanceConditionEvent
  | addValueToAttacksBasedOnAbilityConditionEvent
  | StopConcentrationAndSpellcastingConditionEvent
  | AddBardicInspirationDice;

export function isAddValueToAttacksBasedOnAbilityWithoutTracker(
  data: unknown,
): data is AddValueToAttacksBasedOnAbilityWithoutTracker {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const event = data as {
    type?: unknown;
    value?: unknown;
  };

  const hasRightType =
    event.type === "addValueToAttacksBasedOnAbilityConditionEvent";

  const hasValue = typeof event.value === "number";

  return hasRightType && hasValue;
}



