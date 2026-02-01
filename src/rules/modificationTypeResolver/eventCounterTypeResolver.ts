import type { Character } from "../../types/character.types";
import type { CountersInterface } from "../../types/counters.types";
import {
  type ModificationsProp,
  hasDiceRoll,
} from "../../types/ModificationProps.type";
import type { TargetInterface } from "../../types/targets.types";
import { getModificationId } from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { onRemovingCounter } from "./removingCounter";

type EventCounterTypeResolver = Pick<
  ModificationTypeResolver,
  | "addEventCounter"
  | "addThrowingDiceEventTrackingCounter"
  | "addEventWithTriggerCounter"
>;

function onAddingEventCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addEventCounter" }>,
): CountersInterface[] {
  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      type: "event",
      source: mod.source,
      events: mod.events,
      replenish: mod.replenish,
      remainingUses: mod.usages,
      maxUses: mod.usages,
    },
  ];
}

function onAddingThrowingDiceEventTrackingCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<
    ModificationsProp,
    { type: "addThrowingDiceEventTrackerCounter" }
  >,
): CountersInterface[] {
  const diceRollsToFindArray: TargetInterface[] = [];

  for (let i = 0; i < mod.events.length; i++) {
    const event = mod.events[i];

    if (hasDiceRoll(event)) {
      diceRollsToFindArray.push(...event.diceRoll);
    }
  }

  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      type: "throwingDiceEventTracker",
      source: mod.source,
      events: mod.events,
      replenish: mod.replenish,
      remainingUses: mod.usages,
      maxUses: mod.usages,
      targetsToTrack: diceRollsToFindArray,
    },
  ];
}

function onAddingEventWithTriggerCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addEventWithTriggerCounter" }>,
): CountersInterface[] {
  return [
    ...target,
    {
      name: mod.name,
      source: mod.source,
      type: "eventWithTrigger",
      id: getModificationId(mod),
      events: mod.events,
      trigger: mod.trigger,
    },
  ];
}

export const eventCounterTypeResolver: EventCounterTypeResolver = {
  addEventCounter: { apply: onAddingEventCounter, revert: onRemovingCounter },
  addThrowingDiceEventTrackingCounter: {
    apply: onAddingThrowingDiceEventTrackingCounter,
    revert: onRemovingCounter,
  },
  addEventWithTriggerCounter: {
    apply: onAddingEventWithTriggerCounter,
    revert: onRemovingCounter,
  },
};
