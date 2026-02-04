import type { Character } from "../types/character.types";
import type {
  DamageTypeProp,
  Hp,
  IsHealing,
} from "../types/characterUtils.type";
import {
  hasReplenishMaxAndRemainingUses,
  isContinousEventWithTriggerCounter,
  isReplanishableCounter,
  type CountersInterface,
} from "../types/counters.types";
import type {
  EventCounterProp,
  EventReturn,
} from "../types/EventCounterProp.type";
import { hasDiceInterfaceAndNumbers } from "../types/targets.types";
import { devConsoleWarn } from "../utils/general";
import { isCondition, type IsCuringCondition } from "./arrayOfFeatures";
import { diceAndNumbersToString, getTarget } from "./modificationsExecution";

export interface EventTypeMap {
  replenishCounter: {
    character: Character;
    target: CountersInterface[];
    event: Extract<EventCounterProp, { type: "replenishCounter" }>;
  };
  replenishToValueCounter: {
    character: Character;
    target: CountersInterface[];
    event: Extract<EventCounterProp, { type: "replenishToValueCounter" }>;
  };
  heals: {
    character: Character;
    target: Hp;
    event: Extract<EventCounterProp, { type: "heals" }>;
  };
  trackerHeals: {
    character: Character;
    target: Hp;
    event: Extract<EventCounterProp, { type: "trackerHeals" }>;
  };
  cureOneCondition: {
    character: Character;
    target: IsCuringCondition;
    event: Extract<EventCounterProp, { type: "cureOneCondition" }>;
  };
  useResource: {
    character: Character;
    target: CountersInterface[];
    event: Extract<EventCounterProp, { type: "useResource" }>;
  };
  addResistanceEvent: {
    character: Character;
    target: DamageTypeProp[];
    event: Extract<EventCounterProp, { type: "addResistanceEvent" }>;
  };
}

type EventTypeResolver = {
  [K in keyof EventTypeMap]: (
    character: Character,
    target: EventTypeMap[K]["target"],
    event: EventTypeMap[K]["event"],
  ) => EventReturn<EventTypeMap[K]["target"]>;
};

function onReplenish(
  _character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "replenishCounter" }>,
): EventReturn<CountersInterface[]> {
  return {
    result: target.map((counter) => {
      if (isReplanishableCounter(counter) && counter.id === event.targetId) {
        return {
          ...counter,
          remainingUses: counter.maxUses,
        };
      }

      return counter;
    }),
  };
}

function onReplenishToValue(
  _character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "replenishToValueCounter" }>,
): EventReturn<CountersInterface[]> {
  return {
    result: target.map((counter) => {
      if (
        isReplanishableCounter(counter) &&
        counter.id === event.targetId &&
        counter.remainingUses < event.value
      ) {
        return {
          ...counter,
          remainingUses: event.value,
        };
      }

      return counter;
    }),
  };
}

function onHeal(
  _character: Character,
  target: Hp,
  _event: Extract<EventCounterProp, { type: "heals" }>,
): EventReturn<Hp> {
  const isShown: IsHealing = { isShown: true, information: "" };
  return { result: { ...target, isHealing: isShown } };
}

function onTrackerHeal(
  character: Character,
  target: Hp,
  event: Extract<EventCounterProp, { type: "trackerHeals" }>,
): EventReturn<Hp> {
  const diceToRoll = event.diceRoll.map((element) =>
    getTarget(character, element),
  );

  let isHealing: IsHealing = {
    isShown: true,
    information: null,
  };

  if (hasDiceInterfaceAndNumbers(diceToRoll)) {
    isHealing.information = diceAndNumbersToString(diceToRoll);
  } else {
    devConsoleWarn(
      `onTrackerHeal didn't fetch only numbers and strings`,
      diceToRoll,
    );
  }

  return { result: { ...target, isHealing } };
}

function onCuringOneCondition(
  _character: Character,
  target: IsCuringCondition,
  event: Extract<EventCounterProp, { type: "cureOneCondition" }>,
): EventReturn<IsCuringCondition> {
  if (!event.conditions.every(isCondition)) {
    devConsoleWarn(
      `The property "conditions" of the "cureOneCondition" is not compose only of conditions`,
      event,
    );
    return { result: target };
  }

  return {
    result: { ...target, isShown: true, conditionToCure: event.conditions },
  };
}

function onUseResource(
  character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "useResource" }>,
): EventReturn<CountersInterface[]> {
  const counterRef = getTarget(character, event.isResetCounterRef);
  if (!isContinousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(
      `The counter ref is not a countinous event counter`,
      counterRef,
    );
    return { result: target };
  }

  if (event.resourcesToUse <= 0) {
    devConsoleWarn(
      `the Resources to Use must be bigger than 0`,
      event.resourcesToUse,
    );
    return { result: target };
  }

  const counterIndex = target.findIndex(
    (counter) => counter.id === event.targetId,
  );

  if (counterIndex === -1) {
    devConsoleWarn(`Counter with id ${event.targetId} not found`, target);
    return { result: target };
  }

  const counter = target[counterIndex];

  if (!hasReplenishMaxAndRemainingUses(counter)) {
    devConsoleWarn("The target needs a currentScore property", counter);
    return { result: target };
  }

  let updatedUsage = counter.remainingUses;

  if (counterRef.eventsStatus === "reset") {
    updatedUsage = counter.remainingUses + event.resourcesToUse;

    updatedUsage =
      counter.maxUses < updatedUsage ? counter.maxUses : updatedUsage;
  } else {
    if (counter.remainingUses < event.resourcesToUse) {
      return {
        result: target,
        message: { message: event.message, property: counter.name },
      };
    }

    updatedUsage = counter.remainingUses - event.resourcesToUse;
  }

  const updatedCounter = {
    ...counter,
    remainingUses: updatedUsage,
  };

  const updatedTarget = [...target];
  updatedTarget[counterIndex] = updatedCounter;

  return { result: updatedTarget };
}

function onAddingResistances(
  character: Character,
  target: DamageTypeProp[],
  event: Extract<EventCounterProp, { type: "addResistanceEvent" }>,
): EventReturn<DamageTypeProp[]> {
  const counterRef = getTarget(character, event.isActiveCounterRef);
  if (!isContinousEventWithTriggerCounter(counterRef)) {
    devConsoleWarn(
      `The counter ref is not a countinous event counter`,
      counterRef,
    );
    return { result: target };
  }

  const eventActive = counterRef.eventsStatus === "active";
  
  const resistancesSet = new Set(event.addResistancesTo)

  return {
    result: target.map((damageType) => {
      if (!resistancesSet.has(damageType.type)) {
        return damageType;
      }

      let updatedTrackModification = [...damageType.trackModifications];

      if (eventActive) {
        const modNotAdded = !updatedTrackModification.some(
          (mod) => mod.id === counterRef.id && mod.type === event.type,
        );

        if (modNotAdded) {
          updatedTrackModification = [
            ...updatedTrackModification,
            {
              name: counterRef.name,
              id: counterRef.id,
              source: counterRef.source,
              type: event.type,
            },
          ];
        }
      }

      if (!eventActive) {
        updatedTrackModification = updatedTrackModification.filter(
          (mod) => !(mod.id === counterRef.id && mod.type === event.type),
        );
      }

      const isStillResistant = updatedTrackModification.some(
        (modification) => modification.type === "addResistanceEvent",
      );

      return {
        ...damageType,
        isResistant: isStillResistant,
        trackModifications: updatedTrackModification,
      };
    }),
  };
}


export const eventTypeResolver: EventTypeResolver = {
  replenishCounter: onReplenish,
  replenishToValueCounter: onReplenishToValue,
  heals: onHeal,
  trackerHeals: onTrackerHeal,
  cureOneCondition: onCuringOneCondition,
  useResource: onUseResource,
  addResistanceEvent: onAddingResistances,
};
