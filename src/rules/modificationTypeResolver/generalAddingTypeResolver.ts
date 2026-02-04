import type { Character } from "../../types/character.types";
import type { TrackModifications } from "../../types/trackModifications.types";
import { type ModificationsProp } from "../../types/ModificationProps.type";
import {
  type HasScoresWithTracking,
  hasScoresWithTrackingProperty,
  type HasDamageTypes,
  hasDamageTypesProperty,
  type ScoreWithTrackingAndName,
} from "../../types/targets.types";
import { devConsoleWarn } from "../../utils/general";
import {
  getModificationId,
  removeFromTrackModificationsById,
} from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { getTarget } from "../modificationsExecution";
import { isLevel, type Level } from "../../types/generalRules.types";
import type {
  AbilityProp,
  CharacterFeats,
  SkillProp,
} from "../../types/characterUtils.type";
import { type Ability } from "../arrayOfFeatures";

type GeneralAddingTypeResolver = Pick<
  ModificationTypeResolver,
  | "addValue"
  | "addValueToAbility"
  | "addValueToSkill"
  | "addDamageType"
  | "addValueBasedOnLevel"
  | "addFeat"
  | "increaseMaxLimit"
>;

function onAddingValue(
  _character: Character,
  target: HasScoresWithTracking,
  mod: Extract<ModificationsProp, { type: "addValue" }>,
): HasScoresWithTracking {
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

function onAddingValueToFeature<T extends ScoreWithTrackingAndName>(
  _character: Character,
  target: T[],
  mod: Extract<
    ModificationsProp,
    { type: "addValueToAbility" } | { type: "addValueToSkill" }
  >,
): T[] {
  const featuresSet = new Set<T["name"]>(mod.toWhichFeature);

  return target.map((feature) => {
    if (!featuresSet.has(feature.name)) {
      return feature;
    }

    return {
      ...feature,
      currentScore: feature.currentScore + mod.value,
      trackModifications: [
        ...feature.trackModifications,
        {
          id: getModificationId(mod),
          name: mod.name,
          type: mod.type,
          source: mod.source,
          value: mod.value,
        },
      ],
    };
  });
}

const onAddingValueToAbility = onAddingValueToFeature<AbilityProp>;
const onAddingValueToSkill = onAddingValueToFeature<SkillProp>;

function onRemovingValueToFeature<T extends ScoreWithTrackingAndName>(
  _character: Character,
  target: T[],
  mod: Extract<
    ModificationsProp,
    { type: "addValueToAbility" } | { type: "addValueToSkill" }
  >,
): T[] {
  const featuresSet = new Set<T["name"]>(mod.toWhichFeature);

  return target.map((feature) => {
    if (!featuresSet.has(feature.name)) {
      return feature;
    }

    return {
      ...feature,
      currentScore: feature.currentScore - mod.value,
      trackModifications: removeFromTrackModificationsById(feature, mod),
    };
  });
}

const onRemovingValueToAbility = onRemovingValueToFeature<AbilityProp>;
const onRemovingValueToSkill = onRemovingValueToFeature<SkillProp>;

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

function onRemovingValueBasedOnLevel(
  character: Character,
  target: HasScoresWithTracking,
  mod: Extract<ModificationsProp, { type: "addValueBasedOnLevel" }>,
): HasScoresWithTracking {
  const level = getTarget(character, mod.levelRef);

  if (!isLevel(level)) {
    devConsoleWarn(
      `levelRef is not character or class level in removing value`,
      mod.levelRef,
    );
    return target;
  }

  const modId = getModificationId(mod);

  const isNotApplied = !target.trackModifications.some(
    (modification) => modification.id === modId,
  );

  if (isNotApplied) {
    return target;
  }

  const valueToRemove = mod.valueOnLevel[`level${level}`];

  return {
    ...target,
    currentScore: target.currentScore - valueToRemove,
    trackModifications: removeFromTrackModificationsById(target, mod),
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

function onAddingFeat(
  _character: Character,
  target: CharacterFeats,
  mod: Extract<ModificationsProp, { type: "addFeat" }>,
): CharacterFeats {
  return {
    ...target,
    isAddingFeats: {
      isShown: true,
      addedBy: getModificationId(mod),
      type: mod.featType,
    },
  };
}

function onRemovingFeat(
  _character: Character,
  target: CharacterFeats,
  mod: Extract<ModificationsProp, { type: "addFeat" }>,
): CharacterFeats {
  const modId = getModificationId(mod);

  if (!target.feats.some((feat) => feat.addedBy === modId)) {
    devConsoleWarn(`Couldn't find the adding feature by Id`, target.feats);
    return target;
  }

  const shouldClosePicker =
    target.isAddingFeats.isShown && target.isAddingFeats.addedBy === modId;

  const updatedFeats = target.feats.filter((feat) => feat.addedBy !== modId);

  return {
    ...target,
    feats: updatedFeats,
    isAddingFeats: shouldClosePicker
      ? { isShown: false, addedBy: null }
      : target.isAddingFeats,
  };
}

function onIncreasingMaxLimit(
  _character: Character,
  target: AbilityProp[],
  mod: Extract<ModificationsProp, { type: "increaseMaxLimit" }>,
): AbilityProp[] {
  const featureSet = new Set<Ability>(mod.toWhichAbility);

  const modId = getModificationId(mod)

  return target.map((ability) => {
    if (!featureSet.has(ability.name)) {
      return ability;
    }

    if (ability.trackModifications.some(ab => ab.id === modId)) {
      return ability
    }

    const newMaxLimit = Math.max(mod.newMaxValue, ability.maxLimit);

    return {
      ...ability,
      maxLimit: newMaxLimit,
      trackModifications: [
        ...ability.trackModifications,
        {
          name: mod.name,
          type: mod.type,
          source: mod.source,
          newMaxValue: mod.newMaxValue,
          id: modId,
        },
      ],
    };
  });
}

function onReversingIncreaseMaxLimit(
  _character: Character,
  target: AbilityProp[],
  mod: Extract<ModificationsProp, { type: "increaseMaxLimit" }>,
): AbilityProp[] {
  const featureSet = new Set<Ability>(mod.toWhichAbility);

  return target.map((ability) => {
    if (!featureSet.has(ability.name)) {
      return ability;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      ability,
      mod,
    );

    const filteredModifications = updatedTrackModifications.filter(
      (modification) => modification.type === mod.type,
    );

    const newMaxLimit = filteredModifications.reduce(
      (acc, ab) => Math.max(acc, ab.newMaxValue),
      ability.baseMaxLimit,
    );

    return {
      ...ability,
      maxLimit: newMaxLimit,
      trackModifications: updatedTrackModifications,
    };
  });
}

export const generalAddingTypeResolver: GeneralAddingTypeResolver = {
  addValue: { apply: onAddingValue, revert: onRemovingValue },
  addValueToAbility: {
    apply: onAddingValueToAbility,
    revert: onRemovingValueToAbility,
  },
  addValueToSkill: {
    apply: onAddingValueToSkill,
    revert: onRemovingValueToSkill,
  },
  addValueBasedOnLevel: {
    apply: onAddingValueBasedOnLevel,
    revert: onRemovingValueBasedOnLevel,
  },
  addDamageType: { apply: onAddingDamageType, revert: onRemovingDamageType },
  addFeat: { apply: onAddingFeat, revert: onRemovingFeat },
  increaseMaxLimit: {apply: onIncreasingMaxLimit, revert: onReversingIncreaseMaxLimit }
};
