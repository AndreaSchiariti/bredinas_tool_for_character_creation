import {
  type Replenish,
  type Ability,
  replenishSet,
} from "../rules/arrayOfFeatures";
import type { EventCounterProp } from "./EventCounterProp.type";
import type { DiceInterface } from "./generalRules.types";
import type { DiceBasedOnLevel } from "./ModificationProps.type";
import type { TargetInterface } from "./targets.types";

const counterDice = [
  "dice",
  "diceBasedOnLevel",
  "diceTrackerWithValues",
  "tracer",
  "tracerTracker",
  "valueTracker",
  "difficultyClass",
  "event",
  "throwingDiceEventTracker",
  "eventWithTrigger",
  "continousEventWithTrigger",
] as const;

type CounterType = (typeof counterDice)[number];

const counterTypeSet = new Set<CounterType>(counterDice);

interface CounterBase {
  name: string;
  id: string;
  source: string;
}

interface Replenishable extends CounterBase{
  maxUses: number;
  remainingUses: number;
  replenish: Replenish;
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
    typeof replenish === "string" && replenishSet.has(replenish as Replenish);

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

interface DiceBaseOnLevelCounterInterface extends CounterBase {
  type: "diceBasedOnLevel";
  diceOnLevel: DiceBasedOnLevel;
  classLevel: TargetInterface;
}

interface DiceCounterTrackerWithValuesInterface
  extends TrackerBase {
  type: "diceTrackerWithValues";
  dice: DiceInterface[];
  value: number;
  featureDice?: DiceInterface[];
  featureValue?: number;
}

export interface TracerCounterInterface extends Replenishable {
  type: "tracer";
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
}

interface EventCounterInterface extends EventCounterBase, Replenishable {
  type: "event";
}

interface ThrowingDiceEventTrackerCounterInterface
  extends EventCounterBase, TrackerBase , Replenishable{
  type: "throwingDiceEventTracker";
}

interface EventWithTriggerCounterInterface extends CounterBase {
  type: "eventWithTrigger";
  events: EventCounterProp[];
  trigger: string;
}

interface ContinousEventWithTriggerCounterInterface extends EventCounterBase {
  type: "continousEventWithTrigger"
  trigger: string
  eventsStatus: "active" | "inactive" | "reset"
}

export type CountersInterface =
  | DifficultyClassCounterInterface
  | DiceCounterInterface
  | DiceBaseOnLevelCounterInterface
  | DiceCounterTrackerWithValuesInterface
  | TracerCounterInterface
  | TracerTrackerCounterInterface
  | ValueTrackerCounterInterface
  | EventCounterInterface
  | ThrowingDiceEventTrackerCounterInterface
  | EventWithTriggerCounterInterface
  | ContinousEventWithTriggerCounterInterface;

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
  const hasEventsStatus = counter.eventsStatus === "inactive" || counter.eventsStatus === "reset";
  

  return hasCorrectType && hasTrigger && hasEventsStatus
}

export function isContinousEventWithTriggerCounter(data:unknown) : data is ContinousEventWithTriggerCounterInterface {
  return isCountersInterface(data) && isContinousEventWithTrigger(data)
}
