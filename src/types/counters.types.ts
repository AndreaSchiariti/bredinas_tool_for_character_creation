import type { Replenish, Ability } from "../rules/arrayOfFeatures";
import type { EventCounterProp } from "./EventCounterProp.type";
import type { DiceInterface } from "./generalRules.types";
import type { DiceBasedOnLevel } from "./ModificationProps.type";
import type { TargetInterface } from "./targets.types";

interface CounterBase {
  name: string;
  id: string;
  source: string;
}

interface Replenishable {
  maxUses: number;
  remainingUses: number;
  replenish: Replenish;
}

interface DiceCounterBase extends CounterBase {
  dice: DiceInterface;
}

interface TrackerBase {
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
  extends CounterBase, TrackerBase {
  type: "diceTrackerWithValues";
  dice: DiceInterface[];
  value: number;
  featureDice?: DiceInterface[];
  featureValue?: number;
}

export interface TracerCounterInterface extends CounterBase, Replenishable {
  type: "tracer";
}

export interface TracerTrackerCounterInterface
  extends CounterBase, Replenishable, TrackerBase {
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

interface EventCounterBase extends Replenishable {
  events: EventCounterProp[];
}
interface EventCounterInterface extends CounterBase, EventCounterBase {
  type: "event";
}

interface ThrowingDiceEventTrackerCounterInterface
  extends CounterBase, EventCounterBase, TrackerBase {
  type: "throwingDiceEventTracker";
}

interface EventWithTriggerCounterInterface extends CounterBase {
  type: "eventWithTrigger";
  events: EventCounterProp[];
  trigger: string;
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
  | EventWithTriggerCounterInterface;

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
