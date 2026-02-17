import type { Character } from "../../types/character.types";
import type { TrackModifications } from "../../types/trackModifications.types";
import { type ModificationsProp } from "../../types/ModificationProps.type";
import {
  type HasScoresWithTracking,
  type HasDamageTypes,
  type ScoreWithTrackingAndName,
} from "../../types/targets.types";
import { devConsoleWarn } from "../../utils/general";
import {
  getModificationId,
  removeFromTrackModificationsById,
  removeFromTrackModificationsByMod,
} from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { getTarget } from "../modificationsExecution";
import { isLevel, type Level } from "../../types/generalRules.types";
import {
  type Ability,
  type AbilityProp,
  type CharacterSkills,
  type SkillProp,
} from "../../types/features.type.ts/abilitiesAndSkills.type";
import type { CharacterFeats } from "../../types/features.type.ts/feat.type";
import type { CharacterWeaponMastery } from "../../types/characterUtils.type";
import { modificationIsApplied } from "../characterCalculations";
import { hasValueProperty } from "../../types/generalGuardingFunction";

type GeneralAddingTypeResolver = Pick<
  ModificationTypeResolver,
  | "addValue"
  | "addValueToAbility"
  | "addValueToSkill"
  | "addDamageType"
  | "addValueBasedOnLevel"
  | "addFeat"
  | "increaseMaxLimit"
  | "addWeaponMasteryBasedOnLevel"
>;

function onAddingValue(
  _character: Character,
  target: HasScoresWithTracking,
  mod: Extract<ModificationsProp, { type: "addValue" }>,
): HasScoresWithTracking {
  const modId = getModificationId(mod);

  const newTrackModifications: TrackModifications[] = [
    ...target.trackModifications,
    {
      id: modId,
      name: mod.name,
      type: mod.type,
      source: mod.source,
      value: mod.value,
    },
  ];

  const isAlreadyApplied = modificationIsApplied(
    target.trackModifications,
    modId,
  );

  return isAlreadyApplied
    ? target
    : {
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
  const modId = getModificationId(mod);

  const isNotApplied = !modificationIsApplied(target.trackModifications, modId);

  return isNotApplied
    ? target
    : {
        ...target,
        currentScore: target.currentScore - mod.value,
        trackModifications: removeFromTrackModificationsById(target, modId),
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

  const modId = getModificationId(mod);

  return target.map((feature) => {
    if (!featuresSet.has(feature.name)) {
      return feature;
    }

    const isAlreadyApplied = modificationIsApplied(
      feature.trackModifications,
      modId,
    );

    return isAlreadyApplied
      ? feature
      : {
          ...feature,
          currentScore: feature.currentScore + mod.value,
          trackModifications: [
            ...feature.trackModifications,
            {
              id: modId,
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

function onAddingValueToSkill(
  character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addValueToSkill" }>,
): CharacterSkills {
  return {
    ...target,
    skillsList: onAddingValueToFeature<SkillProp>(
      character,
      target.skillsList,
      mod,
    ),
  };
}

function onRemovingValueToFeature<T extends ScoreWithTrackingAndName>(
  _character: Character,
  target: T[],
  mod: Extract<
    ModificationsProp,
    { type: "addValueToAbility" } | { type: "addValueToSkill" }
  >,
): T[] {
  const featuresSet = new Set<T["name"]>(mod.toWhichFeature);

  const modId = getModificationId(mod);

  return target.map((feature) => {
    if (!featuresSet.has(feature.name)) {
      return feature;
    }

    const isNotApplied = !modificationIsApplied(
      feature.trackModifications,
      modId,
    );

    return isNotApplied
      ? feature
      : {
          ...feature,
          currentScore: feature.currentScore - mod.value,
          trackModifications: removeFromTrackModificationsById(feature, modId),
        };
  });
}

const onRemovingValueToAbility = onRemovingValueToFeature<AbilityProp>;

function onRemovingValueToSkill(
  character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addValueToSkill" }>,
): CharacterSkills {
  return {
    ...target,
    skillsList: onRemovingValueToFeature<SkillProp>(
      character,
      target.skillsList,
      mod,
    ),
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

  const isNotApplied = !modificationIsApplied(target.trackModifications, modId);

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
    modId,
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

  const isNotApplied = !modificationIsApplied(target.trackModifications, modId);

  if (isNotApplied) {
    return target;
  }

  const valueToRemove = mod.valueOnLevel[`level${level}`];

  return {
    ...target,
    currentScore: target.currentScore - valueToRemove,
    trackModifications: removeFromTrackModificationsById(target, modId),
  };
}

function onAddingDamageType(
  _character: Character,
  target: HasDamageTypes,
  mod: Extract<ModificationsProp, { type: "addDamageType" }>,
): HasDamageTypes {
  const modId = getModificationId(mod);

  const updatedTrackModifications: TrackModifications[] = [
    ...target.trackModifications,
    {
      name: mod.name,
      id: modId,
      source: mod.source,
      type: mod.type,
      damageType: mod.damageType,
    },
  ];

  const isAlreadyApplied = modificationIsApplied(
    target.trackModifications,
    modId,
  );

  return isAlreadyApplied
    ? target
    : {
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
  if (
    !modificationIsApplied(target.trackModifications, getModificationId(mod))
  ) {
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
    trackModifications: removeFromTrackModificationsByMod(target, mod),
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
      ? { isShown: false }
      : target.isAddingFeats,
  };
}

function onIncreasingMaxLimit(
  _character: Character,
  target: AbilityProp[],
  mod: Extract<ModificationsProp, { type: "increaseMaxLimit" }>,
): AbilityProp[] {
  const featureSet = new Set<Ability>(mod.toWhichAbility);

  const modId = getModificationId(mod);

  return target.map((ability) => {
    if (!featureSet.has(ability.name)) {
      return ability;
    }

    if (modificationIsApplied(ability.trackModifications, modId)) {
      return ability;
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

    const updatedTrackModifications = removeFromTrackModificationsByMod(
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

function onAddingWeaponMasteryBasedOnLevel(
  character: Character,
  target: CharacterWeaponMastery | null,
  mod: Extract<ModificationsProp, { type: "addWeaponMasteryBasedOnLevel" }>,
): CharacterWeaponMastery | null {
  const level = getTarget(character, mod.levelRef);

  if (!isLevel(level)) {
    devConsoleWarn(
      `levelRef is not character or class level in add weapon mastery`,
      mod.levelRef,
    );
    return target;
  }

  const value = mod.valueOnLevel[`level${level}`];

  const modId = getModificationId(mod);

  const thisModification: TrackModifications = {
    name: mod.name,
    type: mod.type,
    id: modId,
    source: mod.source,
    value: value,
  };

  if (!target) {
    return {
      available: value,
      weapons: [],
      trackModifications: [thisModification],
    };
  }

  const modAlreadyApplied = target.trackModifications.find(
    (modification) => modification.id === modId,
  );

  if (!modAlreadyApplied) {
    return {
      ...target,
      available: target.available + value,
      trackModifications: [...target.trackModifications, thisModification],
    };
  }

  if (!hasValueProperty(modAlreadyApplied)) {
    devConsoleWarn(
      `track modification of the specific Id should have value property`,
      modAlreadyApplied,
    );
    return target;
  }

  const delta = value - modAlreadyApplied.value;

  const updatedTrackModifications = target.trackModifications.map(
    (modification) => {
      return modification.id === modId ? thisModification : modification;
    },
  );

  return {
    ...target,
    available: target.available + delta,
    trackModifications: updatedTrackModifications,
  };
}

function onRemovingWeaponMasteryBasedOnLevel(
  _character: Character,
  target: CharacterWeaponMastery | null,
  mod: Extract<ModificationsProp, { type: "addWeaponMasteryBasedOnLevel" }>,
): CharacterWeaponMastery | null {
  if (!target) {
    return target;
  }

  const modId = getModificationId(mod);

  const currentModification = target.trackModifications.find(
    (modification) => modification.id === modId,
  );

  if (!currentModification) {
    return target;
  }

  if (!hasValueProperty(currentModification)) {
    devConsoleWarn(
      `track modification of the specific Id should have value property`,
      currentModification,
    );
    return target;
  }

  const updatedValue = Math.max(
    0,
    target.available - currentModification.value,
  );

  return {
    ...target,
    available: updatedValue,
    trackModifications: removeFromTrackModificationsById(target, modId),
  };
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
  increaseMaxLimit: {
    apply: onIncreasingMaxLimit,
    revert: onReversingIncreaseMaxLimit,
  },
  addWeaponMasteryBasedOnLevel: {
    apply: onAddingWeaponMasteryBasedOnLevel,
    revert: onRemovingWeaponMasteryBasedOnLevel,
  },
 
};
