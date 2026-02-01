import type { Character } from "../../types/character.types";
import type { CountersInterface } from "../../types/counters.types";
import type { ModificationsProp } from "../../types/ModificationProps.type";
import  { hasOnlyNumbers } from "../../types/targets.types";
import { devConsoleWarn } from "../../utils/general";
import  { getModificationId } from "../idBuilder";
import  { getTarget } from "../modificationsExecution";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import  { onRemovingCounter } from "./removingCounter";

type GeneralCounterTypeResolver = Pick<
  ModificationTypeResolver,
  | "addTracerCounter"
  | "addTracerTrackerCounter"
  | "addValueTrackerCounter"
  | "addDifficultyClassCounter"
>;

function onAddingTracerCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addTracerCounter" }>,
): CountersInterface[] {
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

function onAddingTracerTrackerCounter(
  character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addTracerTrackerCounter" }>,
): CountersInterface[] {
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
      id: getModificationId(mod),
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
  const valuesFetched = mod.valuesToTrack.map((value) =>
    getTarget(character, value),
  );

  if (!hasOnlyNumbers(valuesFetched)) {
    devConsoleWarn(`${valuesFetched} are not only values`, mod.valuesToTrack);

    return [
      ...target,
      {
        name: mod.name,
        id: getModificationId(mod),
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
  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      type: "difficultyClass",
      ability: mod.ability,
      source: mod.source,
    },
  ];
}

export const generalCounterTypeResolver: GeneralCounterTypeResolver = {
  addTracerCounter: { apply: onAddingTracerCounter, revert: onRemovingCounter },
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
};