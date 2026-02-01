import type { Character } from "../types/character.types";
import type { Hp, IsHealing } from "../types/characterUtils.type";
import {
  isReplanishableCounter,
  type CountersInterface,
} from "../types/counters.types";
import type { EventCounterProp } from "../types/EventCounterProp.type";
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
    target: IsCuringCondition | null;
    event: Extract<EventCounterProp, { type: "cureOneCondition" }>;
  };
}

type EventTypeResolver = {
  [K in keyof EventTypeMap]: (
    character: Character,
    target: EventTypeMap[K]["target"],
    event: EventTypeMap[K]["event"],
  ) => EventTypeMap[K]["target"];
};

function onReplenish(
  _character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "replenishCounter" }>,
): CountersInterface[] {
  return target.map((counter) => {
    if (isReplanishableCounter(counter) && counter.id === event.targetId) {
      return {
        ...counter,
        remainingUses: counter.maxUses,
      };
    }

    return counter;
  });
}

function onReplenishToValue(
  _character: Character,
  target: CountersInterface[],
  event: Extract<EventCounterProp, { type: "replenishToValueCounter" }>,
): CountersInterface[] {
  return target.map((counter) => {
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
  });
}

function onHeal(
  _character: Character,
  target: Hp,
  _event: Extract<EventCounterProp, { type: "heals" }>,
): Hp {
  const isShown: IsHealing = { isShown: true, information: "" };
  return { ...target, isHealing: isShown };
}

function onTrackerHeal(
  character: Character,
  target: Hp,
  event: Extract<EventCounterProp, { type: "trackerHeals" }>,
): Hp {
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

  return { ...target, isHealing };
}

function onCuringOneCondition(
  _character: Character,
  target: IsCuringCondition | null,
  event: Extract<EventCounterProp, { type: "cureOneCondition" }>,
): IsCuringCondition | null {
  if (!event.conditions.every(isCondition)) {
    devConsoleWarn(
      `The property "conditions" of the "cureOneCondition" is not compose only of conditions`,
      event,
    );
    return null;
  }

  return { ...target, isShown: true, conditionToCure: event.conditions };
}

export const eventTypeResolver: EventTypeResolver = {
  replenishCounter: onReplenish,
  replenishToValueCounter: onReplenishToValue,
  heals: onHeal,
  trackerHeals: onTrackerHeal,
  cureOneCondition: onCuringOneCondition,
};
