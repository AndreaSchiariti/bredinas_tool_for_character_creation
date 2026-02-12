
import type { EventCounterProp } from "./EventCounterProp.type";
import type { Ability } from "./features.type.ts/abilitiesAndSkills.type";
import { type Rest, restSet } from "./features.type.ts/rests.type";
import type { DiceInterface } from "./generalRules.types";
import type {
  DiceBasedOnLevel,
  ValueBasedOnLevel,
} from "./ModificationProps.type";
import type { TargetInterface } from "./targets.types";
import type { ModificationLimitation } from "./trackModifications.types";

interface CounterBase {
  name: string;
  id: string;
  source: string;
}

interface AdditionalReplenish {
  replenish: Rest;
  value: number | TargetInterface;
}

interface Replenishable extends CounterBase {
  maxUses: number;
  remainingUses: number;
  replenish: Rest;
  additionalReplenish?: AdditionalReplenish;
}

export function hasReplenishMaxAndRemainingUses(
  data: unknown,
): data is Replenishable {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const replanishable = data as {
    maxUses?: unknown;
    remainingUses?: unknown;
    replenish?: unknown;
  };

  const replenish = replanishable.replenish;

  const hasUses =
    typeof replanishable.maxUses === "number" &&
    typeof replanishable.remainingUses === "number";

  const hasReplenish =
    typeof replenish === "string" && restSet.has(replenish as Rest);

  return hasUses && hasReplenish;
}

interface DiceCounterBase extends CounterBase {
  dice: DiceInterface;
}

interface TrackerBase extends CounterBase {
  targetsToTrack: TargetInterface[];
}

interface DiceCounterInterface extends DiceCounterBase {
  type: "dice";
}

interface DiceBaseOnLevelCounterInterface extends DiceCounterBase {
  type: "diceBasedOnLevel";
  diceOnLevel: DiceBasedOnLevel;
  levelRef: TargetInterface;
}

interface DiceCounterTrackerWithValuesInterface extends TrackerBase {
  type: "diceTrackerWithValues";
  dice: DiceInterface[];
  value: number;
  featureDice?: DiceInterface[];
  featureValue?: number;
}

export interface TracerCounterInterface extends Replenishable {
  type: "tracer";
}

interface TracerBasedOnLevel extends Replenishable {
  type: "tracerBasedOnLevel";
  usageOnLevel: ValueBasedOnLevel;
  levelRef: TargetInterface;
}

export interface TracerTrackerCounterInterface
  extends Replenishable, TrackerBase {
  type: "tracerTracker";
}

export interface ValueTrackerCounterInterface extends CounterBase {
  type: "valueTracker";
  value: number;
}

interface DifficultyClassCounterInterface extends CounterBase {
  type: "difficultyClass";
  ability: Ability;
}

interface EventCounterBase extends CounterBase {
  events: EventCounterProp[];
  limitations?: ModificationLimitation[];
}

interface EventCounterInterface extends EventCounterBase, Replenishable {
  type: "event";
}

interface AddTracerEventCounterInterface
  extends EventCounterBase, Replenishable {
  type: "tracerEventCounter";
}

interface EventWithTriggerCounterInterface extends EventCounterBase {
  type: "eventWithTrigger";
  trigger: string;
}

export type ContinousEventStatus = "active" | "inactive" | "reset";

interface ContinousEventWithTriggerCounterInterface extends EventCounterBase {
  type: "continuousEventWithTrigger";
  trigger: string;
  eventsStatus: "active" | "inactive" | "reset";
}

interface ValueBasedOnLevelCounter extends CounterBase {
  type: "valueBasedOnLevel";
  value: number;
  valueBasedOnLevel: ValueBasedOnLevel;
  levelRef: TargetInterface;
}

interface CountingCounter extends CounterBase {
  type: "countingCounter",
  value: number,
  startingValue: number,
  reset: Rest
}

export type CountersInterface =
  | DifficultyClassCounterInterface
  | DiceCounterInterface
  | DiceBaseOnLevelCounterInterface
  | DiceCounterTrackerWithValuesInterface
  | TracerCounterInterface
  | TracerBasedOnLevel
  | TracerTrackerCounterInterface
  | ValueTrackerCounterInterface
  | EventCounterInterface
  | AddTracerEventCounterInterface
  | EventWithTriggerCounterInterface
  | ContinousEventWithTriggerCounterInterface
  | ValueBasedOnLevelCounter
  | CountingCounter;

const counterType: CountersInterface["type"][] = [
  "dice",
  "diceTrackerWithValues",
  "tracer",
  "tracerBasedOnLevel",
  "tracerTracker",
  "valueTracker",
  "difficultyClass",
  "event",
  "tracerEventCounter",
  "eventWithTrigger",
  "continuousEventWithTrigger",
  "valueBasedOnLevel",
  "countingCounter"
] as const;

type CounterType = (typeof counterType)[number];

const counterTypeSet = new Set<CounterType>(counterType);

export type HasDiceCounter = Extract<
  CountersInterface,
  { dice: DiceInterface }
>;

export function isDiceCounter(
  counter: CountersInterface,
): counter is HasDiceCounter {
  return "dice" in counter;
}

export type ReplenishableCounter = Extract<CountersInterface, Replenishable>;

export function isReplanishableCounter(
  counter: CountersInterface,
): counter is ReplenishableCounter {
  return "replenish" in counter;
}

export function isCountersInterface(data: unknown): data is CountersInterface {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const counter = data as {
    name?: unknown;
    id?: unknown;
    source?: unknown;
    type?: unknown;
  };

  const dataName = typeof counter.name === "string";
  const dataId = typeof counter.id === "string";
  const dataSource = typeof counter.source === "string";
  const dataType =
    typeof counter.type === "string" &&
    counterTypeSet.has(counter.type as CounterType);

  return dataName && dataId && dataSource && dataType;
}

export function isContinousEventWithTrigger(
  data: unknown,
): data is ContinousEventWithTriggerCounterInterface {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const counter = data as {
    type?: unknown;
    trigger?: unknown;
    eventsStatus?: unknown;
  };

  const hasCorrectType = counter.type === "continousEventWithTrigger";
  const hasTrigger = typeof counter.trigger === "string";
  const hasEventsStatus =
    counter.eventsStatus === "inactive" || counter.eventsStatus === "reset";

  return hasCorrectType && hasTrigger && hasEventsStatus;
}

export function isContinuousEventWithTriggerCounter(
  data: unknown,
): data is ContinousEventWithTriggerCounterInterface {
  return isCountersInterface(data) && isContinousEventWithTrigger(data);
}
