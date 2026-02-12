import type { Character } from "../../types/character.types";
import type { CountersInterface } from "../../types/counters.types";
import { isLevel } from "../../types/generalRules.types";
import type { ModificationsProp } from "../../types/ModificationProps.type";
import { hasOnlyNumbers } from "../../types/targets.types";
import { devConsoleWarn } from "../../utils/general";
import { counterAlreadyPresent } from "../characterCalculations";
import { getModificationId } from "../idBuilder";
import { getTarget } from "../modificationsExecution";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { onRemovingCounter } from "./removingCounter";

type GeneralCounterTypeResolver = Pick<
  ModificationTypeResolver,
  | "addTracerCounter"
  | "addTracerBasedOnLevelCounter"
  | "addTracerTrackerCounter"
  | "addValueTrackerCounter"
  | "addDifficultyClassCounter"
  | "addValueBasedOnLevelCounter"
  | "addCountingCounter"
>;

function onAddingTracerCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addTracerCounter" }>,
): CountersInterface[] {
  const counterId = getModificationId(mod);

  if (counterAlreadyPresent(target, counterId)) {
    return target
  }

  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      type: "tracer",
      maxUses: mod.usages,
      remainingUses: mod.usages,
      replenish: mod.replenish,
      source: mod.source,
    },
  ];
}

function onAddingValueBasedOnLevelCounter(
  character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addValueBasedOnLevelCounter" }>,
): CountersInterface[] {
  const counterId = getModificationId(mod);

  if (counterAlreadyPresent(target, counterId)) {
    return target;
  }

  const level = getTarget(character, mod.levelRef);

  if (!isLevel(level)) {
    devConsoleWarn(
      `The value based on level of the Value counter have to be a number`,
      level,
    );
    return target;
  }

  const value = mod.valueOnLevel[`level${level}`];

  return [
    ...target,
    {
      name: mod.name,
      id: counterId,
      type: "valueBasedOnLevel",
      source: mod.source,
      levelRef: mod.levelRef,
      value: value,
      valueBasedOnLevel: mod.valueOnLevel
    },
  ];
}

function onAddingTracerBasedOnLevelCounter(
  character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addTracerBasedOnLevelCounter" }>,
): CountersInterface[] {
  const counterId = getModificationId(mod);

  if (counterAlreadyPresent(target, counterId)) {
    return target;
  }

  const level = getTarget(character, mod.levelRef);

  if (!isLevel(level)) {
    devConsoleWarn(
      `The value based on level of the Tracer counter have to be a number`,
      level,
    );
    return target;
  }

  const additionalReplenish = mod.additionalReplenish

  const uses = mod.usageOnLevel[`level${level}`];

  return [
    ...target,
    {
      name: mod.name,
      id: counterId,
      type: "tracerBasedOnLevel",
      source: mod.source,
      usageOnLevel: mod.usageOnLevel,
      maxUses: uses,
      remainingUses: uses,
      replenish: mod.replenish,
      levelRef: mod.levelRef,
      additionalReplenish
    },
  ];
}

function onAddingTracerTrackerCounter(
  character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addTracerTrackerCounter" }>,
): CountersInterface[] {
  const counterId = getModificationId(mod);

  if (counterAlreadyPresent(target, counterId)) {
    return target;
  }

  const trackedValues = mod.targetsToTrack.map((traced) =>
    getTarget(character, traced),
  );

  let value: number = 0;

  if (hasOnlyNumbers(trackedValues)) {
    value = trackedValues.reduce(
      (accumulator, traced) => accumulator + traced,
      0,
    );
  }

  return [
    ...target,
    {
      name: mod.name,
      id: counterId,
      type: "tracerTracker",
      maxUses: value,
      remainingUses: value,
      replenish: mod.replenish,
      source: mod.source,
      targetsToTrack: mod.targetsToTrack,
    },
  ];
}

function onAddingValueTrackerCounter(
  character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addValueTrackerCounter" }>,
): CountersInterface[] {
  const counterId = getModificationId(mod);

  if (counterAlreadyPresent(target, counterId)) {
    return target;
  }

  const valuesFetched = mod.valuesToTrack.map((value) =>
    getTarget(character, value),
  );

  if (!hasOnlyNumbers(valuesFetched)) {
    devConsoleWarn(`${valuesFetched} are not only values`, mod.valuesToTrack);

    return [
      ...target,
      {
        name: mod.name,
        id: counterId,
        type: "valueTracker",
        value: 0,
        source: mod.source,
      },
    ];
  }

  const value = valuesFetched.reduce(
    (accumulator, value) => accumulator + value,
    0,
  );

  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      type: "valueTracker",
      value: value,
      source: mod.source,
    },
  ];
}
// The Difficulty Class of the ability is stored in the
// character.abilities, this will give reference to that
// value.
function onAddingDifficultyClassCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addDifficultyClassCounter" }>,
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
      type: "difficultyClass",
      ability: mod.ability,
      source: mod.source,
    },
  ];
}

function onAddingCountingCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addCountingCounter" }>,
) : CountersInterface[] {
  const counterId = getModificationId(mod);

  if (counterAlreadyPresent(target, counterId)) {
    return target;
  }

  const countingCounter: Extract<CountersInterface, {type: "countingCounter"}> = {
    name: mod.name,
    type: "countingCounter",
    id: counterId,
    value: mod.startingValue,
    startingValue: mod.startingValue,
    source: mod.source,
    reset: mod.reset
  }

  return [...target, countingCounter]
};

export const generalCounterTypeResolver: GeneralCounterTypeResolver = {
  addTracerCounter: { apply: onAddingTracerCounter, revert: onRemovingCounter },
  addTracerBasedOnLevelCounter: {
    apply: onAddingTracerBasedOnLevelCounter,
    revert: onRemovingCounter,
  },
  addTracerTrackerCounter: {
    apply: onAddingTracerTrackerCounter,
    revert: onRemovingCounter,
  },
  addValueTrackerCounter: {
    apply: onAddingValueTrackerCounter,
    revert: onRemovingCounter,
  },
  addDifficultyClassCounter: {
    apply: onAddingDifficultyClassCounter,
    revert: onRemovingCounter,
  },
  addValueBasedOnLevelCounter: {
    apply: onAddingValueBasedOnLevelCounter,
    revert: onRemovingCounter
  },
  addCountingCounter: {
    apply: onAddingCountingCounter,
    revert: onRemovingCounter
  }
};
