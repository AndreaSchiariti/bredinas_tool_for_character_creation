import type { InternalFeatureLimitationMap } from "../../rules/limitations/internalFeatureLimitation";
import type { InfoForUser } from "../character.types/characterUtils.type";
import type {
  Ability,
  SkillPropName,
} from "../features.types/abilitiesAndSkills.type";
import type { Condition } from "../features.types/conditions.type";
import type { DamageTypes } from "../features.types/damageTypes.type";
import type { DiceInterface } from "../generalRules.types/dice.types";
import type { ModifyValue } from "../generalRules.types/operation.types";

import type { TargetInterface } from "../targets.types/targets.types";

interface BaseEventCounter {
  target: TargetInterface[];
  limitations?: (keyof InternalFeatureLimitationMap)[];
}

export interface EventReturn<T> {
  result: T;
  message?: InfoForUser;
}

interface ReplenishEventCounter extends BaseEventCounter {
  type: "replenishCounter";
  targetId: string;
}

interface ReplenishToValueEventCounter extends BaseEventCounter {
  type: "replenishToValueCounter";
  targetId: string;
  value: number;
}

interface HealsEventCounter extends BaseEventCounter {
  type: "heals";
}

interface TrackerHealsEventCounter extends BaseEventCounter {
  type: "trackerHeals";
  diceRoll: TargetInterface[];
  message: string;
}

interface CureOneConditionEventCounter extends BaseEventCounter {
  type: "cureOneCondition";
  conditions: Condition[];
}

interface CheckActiveCounterRef extends BaseEventCounter {
  activeCounterRef: TargetInterface;
}

interface UseResourceEventCounter extends BaseEventCounter {
  type: "useResource";
  targetId: string;
  resourcesToUse: number;
  message: string;
  resetCounterRef: TargetInterface;
}

interface AddResistanceEventCounter extends CheckActiveCounterRef {
  type: "addResistanceEvent";
  addResistancesTo: DamageTypes[];
}

interface ActivateConditionEventCounter extends CheckActiveCounterRef {
  type: "activateConditionEvent";
  conditionsToActivate: Condition[];
}

interface AddAdvantageEventBase extends CheckActiveCounterRef {
  type: "addAdvantageEvent";
}

interface AddAdvantageEventAttack extends AddAdvantageEventBase {
  scope: "attacks";
  features: Ability[];
}

interface AddAdvantageEventSkill extends AddAdvantageEventBase {
  scope: "skills";
  features: SkillPropName[];
}

type AddAdvantageEvent = AddAdvantageEventAttack | AddAdvantageEventSkill;

export type AddAdvantageFeatures = AddAdvantageEvent["features"];

interface AddReminderEvent extends CheckActiveCounterRef {
  type: "addReminderEvent";
  content: string;
}

interface addFetchedScoreEvent extends CheckActiveCounterRef {
  type: "addFetchedScoreEvent";
  fetchedFeature: TargetInterface;
  modifyValue?: ModifyValue;
}

interface addDiceToAttackBasedOnAbilityEvent extends CheckActiveCounterRef {
  type: "addDiceToAttackBasedOnAbilityEvent";
  diceToAdd: DiceInterface | TargetInterface;
  ability: Ability[];
}

export type EventCounterProp =
  | ReplenishEventCounter
  | ReplenishToValueEventCounter
  | HealsEventCounter
  | TrackerHealsEventCounter
  | CureOneConditionEventCounter
  | UseResourceEventCounter
  | AddResistanceEventCounter
  | ActivateConditionEventCounter
  | AddAdvantageEvent
  | AddReminderEvent
  | addFetchedScoreEvent
  | addDiceToAttackBasedOnAbilityEvent;

export type HasDiceRoll = Extract<
  EventCounterProp,
  { diceRoll: TargetInterface[] }
>;

export function hasDiceRoll(event: EventCounterProp): event is HasDiceRoll {
  return "diceRoll" in event;
}
