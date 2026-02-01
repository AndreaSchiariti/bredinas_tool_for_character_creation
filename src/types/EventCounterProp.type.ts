import type { Condition } from "../rules/arrayOfFeatures";
import type { TargetInterface } from "./targets.types";

interface BaseEventCounter {
  target: TargetInterface[];
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
}

interface CureOneConditionEventCounter extends BaseEventCounter {
  type: "cureOneCondition";
  conditions: Condition[];
}

export type EventCounterProp =
  | ReplenishEventCounter
  | ReplenishToValueEventCounter
  | HealsEventCounter
  | TrackerHealsEventCounter
  | CureOneConditionEventCounter;
