import type { Character } from "../../types/character.types";
import type { TrackModifications } from "../../types/trackModifications.types";
import {
  isLevel,
  type Level,
  type ModificationsProp,
} from "../../types/ModificationProps.type";
import {
  type HasScoresWithTracking,
  hasScoresWithTrackingProperty,
  type HasDamageTypes,
  hasDamageTypesProperty,
} from "../../types/targets.types";
import { devConsoleWarn } from "../../utils/general";
import {
  getModificationId,
  removeFromTrackModificationsById,
} from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { getTarget } from "../modificationsExecution";

type GeneralAddingTypeResolver = Pick<
  ModificationTypeResolver,
  "addValue" | "addDamageType"
>;

function onAddingValue(
  _character: Character,
  target: HasScoresWithTracking,
  mod: Extract<ModificationsProp, { type: "addValue" }>,
): HasScoresWithTracking {
  if (!hasScoresWithTrackingProperty(target)) {
    devConsoleWarn(
      `Target of on AddingValue has no scores or trackModifications properties`,
      mod,
    );
    return target;
  }

  const newTrackModifications: TrackModifications[] = [
    ...target.trackModifications,
    {
      id: getModificationId(mod),
      name: mod.name,
      type: mod.type,
      source: mod.source,
      value: mod.value,
    },
  ];

  return {
    ...target,
    currentScore: target.currentScore + mod.value,
    trackModifications: newTrackModifications,
  };
}

function onRemovingValue(
  _character: Character,
  target: HasScoresWithTracking,
  mod: Extract<ModificationsProp, { type: "addValue" }>,
): HasScoresWithTracking {
  if (!hasScoresWithTrackingProperty(target)) {
    devConsoleWarn(
      `Target of on onRemovingValue has no scores or trackModifications properties`,
      mod,
    );
    return target;
  }

  return {
    ...target,
    currentScore: target.currentScore - mod.value,
    trackModifications: removeFromTrackModificationsById(target, mod),
  };
}

function onAddingValueBasedOnLevel(
  character: Character,
  target: HasScoresWithTracking,
  mod: Extract<ModificationsProp, { type: "addValueBasedOnLevel" }>,
): HasScoresWithTracking {
  const level = getTarget(character, mod.levelRef);

  if (!isLevel(level)) {
    devConsoleWarn(
      `levelRef is not character or class level in adding value`,
      mod.levelRef,
    );
    return target;
  }

  const currentValue = mod.valueOnLevel[`level${level}`];
  const prevValue =
    level === 1 ? 0 : mod.valueOnLevel[`level${(level - 1) as Level}`];
  const deltaValue = currentValue - prevValue;

  const modId = getModificationId(mod);

  const isNotApplied = !target.trackModifications.some(
    (modification) => modification.id === modId,
  );

  if (isNotApplied) {
    return {
      ...target,
      currentScore: target.currentScore + currentValue,
      trackModifications: [
        ...target.trackModifications,
        {
          id: modId,
          name: mod.name,
          type: mod.type,
          source: mod.source,
          value: mod.valueOnLevel[`level${level}`],
        },
      ],
    };
  }

  if (deltaValue === 0) {
    return target;
  }

  const cleanedTrackModifications = removeFromTrackModificationsById(
    target,
    mod,
  );

  return {
    ...target,
    currentScore: target.currentScore + deltaValue,
    trackModifications: [
      ...cleanedTrackModifications,
      {
        id: modId,
        name: mod.name,
        type: mod.type,
        source: mod.source,
        value: mod.valueOnLevel[`level${level}`],
      },
    ],
  };
}

function onAddingDamageType(
  _character: Character,
  target: HasDamageTypes,
  mod: Extract<ModificationsProp, { type: "addDamageType" }>,
): HasDamageTypes {
  if (!hasDamageTypesProperty(target)) {
    devConsoleWarn(
      `${target} has no damageTypes array, can't add ${mod.damageType} damage`,
      target,
    );
    return target;
  }

  const updatedTrackModifications: TrackModifications[] = [
    ...target.trackModifications,
    {
      name: mod.name,
      id: getModificationId(mod),
      source: mod.source,
      type: mod.type,
      damageType: mod.damageType,
    },
  ];

  return {
    ...target,
    damageTypes: [...target.damageTypes, mod.damageType],
    trackModifications: updatedTrackModifications,
  };
}

function onRemovingDamageType(
  _character: Character,
  target: HasDamageTypes,
  mod: Extract<ModificationsProp, { type: "addDamageType" }>,
): HasDamageTypes {
  if (!hasDamageTypesProperty(target)) {
    devConsoleWarn(
      `${target} has no damage types array, can't remove ${mod.damageType} damage`,
      target,
    );
    return target;
  }

  const indexOfDamage = target.damageTypes.findIndex(
    (type) => type === mod.damageType,
  );

  if (indexOfDamage === -1) {
    devConsoleWarn(`Can't find ${mod.damageType} in the damage array`, target);
    return target;
  }

  return {
    ...target,
    damageTypes: [
      ...target.damageTypes.slice(0, indexOfDamage),
      ...target.damageTypes.slice(indexOfDamage + 1),
    ],
    trackModifications: removeFromTrackModificationsById(target, mod),
  };
}

export const generalAddingTypeResolver: GeneralAddingTypeResolver = {
  addValue: { apply: onAddingValue, revert: onRemovingValue },
  addDamageType: { apply: onAddingDamageType, revert: onRemovingDamageType },
};
