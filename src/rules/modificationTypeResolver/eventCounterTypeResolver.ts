import type { Character } from "../../types/character.types";
import type { CountersInterface } from "../../types/counters.types";
import {
  type ModificationsProp,
} from "../../types/ModificationProps.type";
import { counterAlreadyPresent } from "../characterCalculations";
import { getModificationId } from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { onRemovingCounter } from "./removingCounter";

type EventCounterTypeResolver = Pick<
  ModificationTypeResolver,
  | "addEventCounter"
  | "addTracerEventCounter"
  | "addEventWithTriggerCounter"
  | "addContinuousEventWithTriggerCounter"
>;

function onAddingEventCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addEventCounter" }>,
): CountersInterface[] {
   const counterId = getModificationId(mod);
  
    if (counterAlreadyPresent(target, counterId)) {
      return target;
    }

  return [
    ...target,
    {
      name: mod.name,
      id: counterId,
      type: "event",
      source: mod.source,
      events: mod.events,
      replenish: mod.replenish,
      remainingUses: mod.usages,
      maxUses: mod.usages,
      limitations: mod.limitationsToEvent ? mod.limitationsToEvent : undefined,
    },
  ];
}

function onAddingTracerEventCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addTracerEventCounter" }>,
): CountersInterface[] {
  const counterId = getModificationId(mod);

  if (counterAlreadyPresent(target, counterId)) {
    return target;
  }

  return [
    ...target,
    {
      name: mod.name,
      id: counterId,
      type: "tracerEventCounter",
      source: mod.source,
      events: mod.events,
      replenish: mod.replenish,
      remainingUses: mod.usages,
      maxUses: mod.usages,
      limitations: mod.limitationsToEvent ? mod.limitationsToEvent : undefined,
    },
  ];
}

function onAddingEventWithTriggerCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addEventWithTriggerCounter" }>,
): CountersInterface[] {
   const counterId = getModificationId(mod);

   if (counterAlreadyPresent(target, counterId)) {
     return target;
   }
  return [
    ...target,
    {
      name: mod.name,
      source: mod.source,
      type: "eventWithTrigger",
      id: counterId,
      events: mod.events,
      trigger: mod.trigger,
      limitations: mod.limitationsToEvent ? mod.limitationsToEvent : undefined,
    },
  ];
}

function onAddingContinuousEventWithTriggerCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<
    ModificationsProp,
    { type: "addContinuousEventWithTriggerCounter" }
  >,
): CountersInterface[] {
   const counterId = getModificationId(mod);

   if (counterAlreadyPresent(target, counterId)) {
     return target;
   }

  return [
    ...target,
    {
      name: mod.name,
      type: "continuousEventWithTrigger",
      id: counterId,
      source: mod.source,
      events: mod.events,
      eventsStatus: "inactive",
      trigger: mod.trigger,
      limitations: mod.limitationsToEvent ? mod.limitationsToEvent : undefined
    },
  ];
}

export const eventCounterTypeResolver: EventCounterTypeResolver = {
  addEventCounter: { apply: onAddingEventCounter, revert: onRemovingCounter },
  addTracerEventCounter: {
    apply: onAddingTracerEventCounter,
    revert: onRemovingCounter,
  },
  addEventWithTriggerCounter: {
    apply: onAddingEventWithTriggerCounter,
    revert: onRemovingCounter,
  },
  addContinuousEventWithTriggerCounter: {
    apply: onAddingContinuousEventWithTriggerCounter,
    revert: onRemovingCounter,
  },
};
