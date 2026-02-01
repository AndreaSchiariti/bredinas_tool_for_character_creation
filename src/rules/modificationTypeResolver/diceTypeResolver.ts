import type { Character } from "../../types/character.types";
import type { TrackModifications } from "../../types/trackModifications.types";
import type { CountersInterface } from "../../types/counters.types";
import {
  type DiceInterface,
  isDiceInterface,
} from "../../types/generalRules.types";
import {
  isLevel,
  type ModificationsProp,
} from "../../types/ModificationProps.type";
import {
  type HasCurrentAndBaseDiceWithTracking,
  hasDiceInterfaceAndNumbers,
} from "../../types/targets.types";
import { devConsoleWarn } from "../../utils/general";
import {
  getModificationId,
  removeFromTrackModificationsById,
} from "../idBuilder";
import { getTarget } from "../modificationsExecution";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { onRemovingCounter } from "./removingCounter";

type DiceTypeResolver = Pick<
  ModificationTypeResolver,
  | "changeDice"
  | "changeDiceBasedOnLevel"
  | "addDiceCounter"
  | "addDiceBasedOnLevelCounter"
  | "addDiceTrackerWithValuesCounter"
>;

function onChangeDice(
  _character: Character,
  target: HasCurrentAndBaseDiceWithTracking,
  mod: Extract<ModificationsProp, { type: "changeDice" }>,
): HasCurrentAndBaseDiceWithTracking {
  const changedTarget = { ...target, currentDice: mod.dice };

  const newTrackModifications: TrackModifications[] = [
    ...changedTarget.trackModifications,
    {
      name: mod.name,
      id: getModificationId(mod),
      source: mod.source,
      type: mod.type,
      dice: mod.dice,
    },
  ];

  return { ...changedTarget, trackModifications: newTrackModifications };
}

function onChangeDiceBasedOnLevel(
  character: Character,
  target: HasCurrentAndBaseDiceWithTracking,
  mod: Extract<ModificationsProp, { type: "changeDiceBasedOnLevel" }>,
): HasCurrentAndBaseDiceWithTracking {
  const classLevel = getTarget(character, mod.levelRef);

  if (!isLevel(classLevel)) {
    devConsoleWarn(
      `The class level in onChangeDiceBasedOnLevel should be a number minor or equal to 20`,
      classLevel,
    );
    return target;
  }

  const diceBasedOnLevel = mod.diceOnLevel[`level${classLevel}`];

  if (!isDiceInterface(diceBasedOnLevel)) {
    devConsoleWarn(
      `The element based on level in onChangeDiceBasedOnLevel should be a dice interface`,
      diceBasedOnLevel,
    );
    return target;
  }

  const changedTarget = {
    ...target,
    currentDice: diceBasedOnLevel,
  };

  const cleanedTrackModification: TrackModifications[] =
    removeFromTrackModificationsById(target, mod);

  const newTrackModifications: TrackModifications[] = [
    ...cleanedTrackModification,
    {
      name: mod.name,
      id: getModificationId(mod),
      source: mod.source,
      type: mod.type,
      dice: diceBasedOnLevel,
    },
  ];

  return { ...changedTarget, trackModifications: newTrackModifications };
}

function onChangeBackDice(
  _character: Character,
  target: HasCurrentAndBaseDiceWithTracking,
  mod: Extract<
    ModificationsProp,
    { type: "changeDice" } | { type: "changeDiceBasedOnLevel" }
  >,
): HasCurrentAndBaseDiceWithTracking {
  return {
    ...target,
    currentDice: target.baseDice,
    trackModifications: removeFromTrackModificationsById(target, mod),
  };
}

function onAddingDiceCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addDiceCounter" }>,
): CountersInterface[] {
  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      type: "dice",
      dice: mod.dice,
      source: mod.source
    },
  ];
}

function onAddingDiceBasedOnLevelCounter(
  _character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addDiceBasedOnLevelCounter" }>,
): CountersInterface[] {
  return [
    ...target,
    {
      name: mod.name,
      id: getModificationId(mod),
      type: "diceBasedOnLevel",
      diceOnLevel: mod.diceOnLevel,
      classLevel: mod.levelRef,
      source: mod.source,
    },
  ];
}

function onAddingDiceTrackerWithValuesCounter(
  character: Character,
  target: CountersInterface[],
  mod: Extract<ModificationsProp, { type: "addDiceTrackerWithValuesCounter" }>,
): CountersInterface[] {
  const valuesFetched = mod.diceRollFetches.map((element) =>
    getTarget(character, element),
  );

  if (hasDiceInterfaceAndNumbers(valuesFetched)) {
    const arrayOfDices: DiceInterface[] = [];
    let totalValue: number = 0;

    for (const element of valuesFetched) {
      if (isDiceInterface(element)) {
        arrayOfDices.push(element);
      } else if (typeof element === "number") {
        totalValue += element;
      }
    }

    if (mod.dice && mod.dice.length > 0) {
      arrayOfDices.push(...mod.dice);
    }

    if (typeof mod.addValue === "number") {
      totalValue += mod.addValue;
    }

    return [
      ...target,
      {
        name: mod.name,
        id: getModificationId(mod),
        type: "diceTrackerWithValues",
        targetsToTrack: mod.diceRollFetches,
        dice: arrayOfDices,
        value: totalValue,
        source: mod.source,
        featureDice: mod.dice,
        featureValue: mod.addValue,
      },
    ];
  }

  return target;
}

export const diceTypeResolver: DiceTypeResolver = {
  changeDice: { apply: onChangeDice, revert: onChangeBackDice },
  changeDiceBasedOnLevel: {
    apply: onChangeDiceBasedOnLevel,
    revert: onChangeBackDice,
  },
  addDiceCounter: { apply: onAddingDiceCounter, revert: onRemovingCounter },
  addDiceBasedOnLevelCounter: {
    apply: onAddingDiceBasedOnLevelCounter,
    revert: onRemovingCounter,
  },
  addDiceTrackerWithValuesCounter: {
    apply: onAddingDiceTrackerWithValuesCounter,
    revert: onRemovingCounter,
  },
};
