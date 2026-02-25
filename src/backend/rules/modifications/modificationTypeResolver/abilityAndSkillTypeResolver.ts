import type { Character } from "../../../types/character.types/character.types";
import type {
  TrackModifications,
} from "../../../types/modifications.types/trackModifications.types";
import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";
import {
  type HasAbilitiesWithTracking,
  type ScoreWithTrackingAndName,
} from "../../../types/targets.types/targets.types";
import type {
  AbilityProp,
  SkillProp,
} from "../../../types/features.types/abilitiesAndSkills.type";
import { isTargetInterface } from "../../../types/guardingFunctions/generalFeaturesGuards";
import { hasValueProperty, type TrackModificationWithValue } from "../../../types/guardingFunctions/trackModificationsGuards";
import { devConsoleWarn, removeFromArrayByIndex } from "../../../utils/general";
import { getModificationId, removeFromTrackModificationsById, removeFromTrackModificationsByMod } from "../../calculationsAndBuilders/idBuilder";
import { getTarget } from "../modificationsExecution";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import { calculateModifyValue } from "../../calculationsAndBuilders/characterCalculations";
import { modificationIsApplied, relatedModStillActive } from "../../calculationsAndBuilders/modCommonFunctions/generalModFunctions";
import { addAdvantageSet, setMinimumTotalSet } from "../../calculationsAndBuilders/modCommonFunctions/modSets";


type AbilityAndSkillTypeResolver = Pick<
  ModificationTypeResolver,
  | "addAbility"
  | "addAbilityToSkill"
  | "addAdvantage"
  | "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility"
  | "addValueToAllNotProficientSkills"
  | "addValueToAbility"
  | "addValueToSkill"
>;

// using this both as the apply and revert function, the mod will be taken by
// the target default value

//function onSetAbility(
//  _character: Character,
//  target: HasSingleAbilityWithTracking,
//  mod: Extract<ModificationsProp, { type: "changeAbilityReference" }>,
//): HasSingleAbilityWithTracking {
//      if(!hasSingleAbilityWithTracking(target)) {
//        devConsoleWarn(`The target for onSetAbility has no ability property`, target)
//        return null
//      }
//
//  const newTrackModifications: TrackModifications[] = [
//    ...target.trackModifications,
//    {
//      name: mod.name,
//      type: mod.type,
//      ability: mod.ability,
//      source: mod.source,
//      id: getModificationId(mod),
//    },
//  ];
//
//  return {
//    ...target,
//    ability: mod.ability,
//    trackModifications: newTrackModifications,
//  };
//}

function onAddingAbility(
  _character: Character,
  target: HasAbilitiesWithTracking,
  mod: Extract<ModificationsProp, { type: "addAbility" }>,
): HasAbilitiesWithTracking {
  const modId = getModificationId(mod);

  const newTrackModifications: TrackModifications[] = [
    ...target.trackModifications,
    {
      name: mod.name,
      type: mod.type,
      ability: mod.ability,
      source: mod.source,
      id: modId,
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
        ability: [...target.ability, mod.ability],
        trackModifications: newTrackModifications,
      };
}

function onAddingAbilityToSkill(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addAbilityToSkill" }>,
): SkillProp[] {
  const modId = getModificationId(mod);

  const toWhichSkillSet = new Set(mod.toWhichSkill);

  const thisModification: Extract<
    TrackModifications,
    { type: "addAbilityToSkill" }
  > = {
    name: mod.name,
    id: modId,
    type: mod.type,
    source: mod.source,
    ability: mod.ability,
  };

  return target.map((skill) => {
    if (
      !toWhichSkillSet.has(skill.name) ||
      modificationIsApplied(skill.trackModifications, modId)
    ) {
      return skill;
    }

    return {
      ...skill,
      ability: [...skill.ability, mod.ability],
      trackModifications: [...skill.trackModifications, thisModification],
    };
  });
}

function onRemovingAbility(
  _character: Character,
  target: HasAbilitiesWithTracking,
  mod: Extract<ModificationsProp, { type: "addAbility" }>,
): HasAbilitiesWithTracking {
  if (
    !modificationIsApplied(target.trackModifications, getModificationId(mod))
  ) {
    return target;
  }

  const index = target.ability.findIndex((ability) => ability === mod.ability);

  const updatedTrackModifications = removeFromTrackModificationsByMod(
    target,
    mod,
  );

  if (index === -1) {
    return { ...target, trackModifications: updatedTrackModifications };
  }

  return {
    ...target,
    ability: removeFromArrayByIndex(target.ability, index),
    trackModifications: updatedTrackModifications,
  };
}

function onRemovingAbilityToSkill(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addAbilityToSkill" }>,
): SkillProp[] {
  const modId = getModificationId(mod);

  const toWhichSkillSet = new Set(mod.toWhichSkill);

  return target.map((skill) => {
    if (
      !toWhichSkillSet.has(skill.name) ||
      !modificationIsApplied(skill.trackModifications, modId)
    ) {
      return skill;
    }

    const abilityIndex = skill.ability.findIndex(
      (ability) => ability === mod.ability,
    );

    const updatedTrackModifications = removeFromTrackModificationsById(
      skill,
      modId,
    );

    if (abilityIndex === -1) {
      devConsoleWarn(
        `Couldn't find the matching ability in the ${skill.name}' ability array`,
        skill.ability,
      );
      return { ...skill, trackModifications: updatedTrackModifications };
    }

    return {
      ...skill,
      ability: removeFromArrayByIndex(skill.ability, abilityIndex),
      trackModifications: updatedTrackModifications,
    };
  });
}

function onAddingAdvantage(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addAdvantage" }>,
): SkillProp[] {
  const featuresSet = new Set(mod.features);

  const modId = getModificationId(mod);

  return target.map((skill) => {
    if (!featuresSet.has(skill.name)) {
      return skill;
    }

    if (modificationIsApplied(skill.trackModifications, modId)) {
      return skill;
    }

    return {
      ...skill,
      hasAdvantage: true,
      trackModifications: [
        ...skill.trackModifications,
        {
          name: mod.name,
          type: mod.type,
          id: modId,
          source: mod.source,
        },
      ],
    };
  });
}

function onRemovingAdvantage(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addAdvantage" }>,
): SkillProp[] {
  const featureSet = new Set(mod.features);

  return target.map((skill) => {
    if (!featureSet.has(skill.name)) {
      return skill;
    }

    const updatedTrackModifications = removeFromTrackModificationsByMod(
      skill,
      mod,
    );

    if (relatedModStillActive(updatedTrackModifications, addAdvantageSet)) {
      return { ...skill, trackModifications: updatedTrackModifications };
    }

    return {
      ...skill,
      hasAdvantage: false,
      trackModifications: updatedTrackModifications,
    };
  });
}

function onSettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility(
  character: Character,
  target: SkillProp[],
  mod: Extract<
    ModificationsProp,
    { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
  >,
): SkillProp[] {
  const modId = getModificationId(mod);

  const abilityAffected = new Set(mod.skillsAbilityAffected);

  const minimumTotal = getTarget(character, mod.abilityScore);

  if (typeof minimumTotal !== "number") {
    devConsoleWarn(
      `the minimumTotal should be a number when setAbilityScore as minimum total`,
      minimumTotal,
    );
    return target;
  }

  return target.map((skill) => {
    if (!abilityAffected.has(skill.currentAbility)) {
      return skill;
    }

    const isAlreadyApplied = modificationIsApplied(
      skill.trackModifications,
      modId,
    );

    if (isAlreadyApplied) {
      return skill;
    }

    const newMinimumTotal =
      skill.minimumCheckTotal !== undefined
        ? Math.max(skill.minimumCheckTotal, minimumTotal)
        : minimumTotal;

    const thisModification: Extract<
      TrackModifications,
      { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
    > = {
      name: mod.name,
      type: mod.type,
      source: mod.source,
      id: modId,
      value: minimumTotal,
    };

    return {
      ...skill,
      minimumCheckTotal: newMinimumTotal,
      trackModifications: [...skill.trackModifications, thisModification],
    };
  });
}

function onUnsettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility(
  _character: Character,
  target: SkillProp[],
  mod: Extract<
    ModificationsProp,
    { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
  >,
): SkillProp[] {
  const modId = getModificationId(mod);

  const abilityAffected = new Set(mod.skillsAbilityAffected);

  return target.map((skill) => {
    if (!abilityAffected.has(skill.currentAbility)) {
      return skill;
    }

    const isNotApplied = !modificationIsApplied(
      skill.trackModifications,
      modId,
    );

    if (isNotApplied) {
      return skill;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      skill,
      modId,
    );

    const otherMinimumTotalModifications = updatedTrackModifications.filter(
      (modification): modification is TrackModificationWithValue =>
        hasValueProperty(modification) &&
        setMinimumTotalSet.has(modification.type),
    );

    if (otherMinimumTotalModifications.length === 0) {
      return {
        ...skill,
        minimumCheckTotal: undefined,
        trackModifications: updatedTrackModifications,
      };
    }

    const newMinimumTotal = otherMinimumTotalModifications.reduce(
      (acc, modification) => Math.max(acc, modification.value),
      0,
    );

    return {
      ...skill,
      minimumCheckTotal: newMinimumTotal,
      trackModifications: updatedTrackModifications,
    };
  });
}

function onAddingValueToAllNotProficientSkills(
  character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addValueToAllNotProficientSkills" }>,
): SkillProp[] {
  const modId = getModificationId(mod);

  let value = isTargetInterface(mod.value)
    ? getTarget(character, mod.value)
    : mod.value;

  if (typeof value !== "number") {
    devConsoleWarn(
      `the mod value must be a number, being it a fetched value or a stored one`,
      value,
    );
    return target;
  }

  if (mod.modifyValue) {
    value = calculateModifyValue(value, mod.modifyValue);
  }

  const thisModification: Extract<
    TrackModifications,
    { type: "addValueToAllNotProficientSkills" }
  > = {
    name: mod.name,
    source: mod.source,
    id: modId,
    type: mod.type,
    value: value,
  };

  return target.map((skill) => {
    const modificationIndex = skill.trackModifications.findIndex(
      (modification) => modification.id === modId,
    );

    const isApplied = modificationIndex !== -1;

    if (skill.hasProficiency) {
      if (!isApplied) {
        return skill;
      }

      const modAlreadyPresent = skill.trackModifications[modificationIndex];

      if (!hasValueProperty(modAlreadyPresent)) {
        devConsoleWarn(
          "The mod already present when adding value to all not proficient skills must have value property",
          modAlreadyPresent,
        );
        return skill;
      }

      return {
        ...skill,
        currentScore: skill.currentScore - modAlreadyPresent.value,
        trackModifications: removeFromTrackModificationsById(skill, modId),
      };
    }

    if (isApplied) {
      const modAlreadyPresent = skill.trackModifications[modificationIndex];

      if (!hasValueProperty(modAlreadyPresent)) {
        devConsoleWarn(
          "The mod already present when adding value to all not proficient skills must have value property",
          modAlreadyPresent,
        );
        return skill;
      }

      const delta = value - modAlreadyPresent.value;

      if (delta === 0) {
        return skill;
      }

      const updatedTrackModifications = skill.trackModifications.map(
        (modification, index) =>
          index === modificationIndex ? thisModification : modification,
      );

      return {
        ...skill,
        currentScore: skill.currentScore + delta,
        trackModifications: updatedTrackModifications,
      };
    }

    return {
      ...skill,
      currentScore: skill.currentScore + value,
      trackModifications: [...skill.trackModifications, thisModification],
    };
  });
}

function onRemovingValueToAllNotProficientSkills(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addValueToAllNotProficientSkills" }>,
): SkillProp[] {
  const modId = getModificationId(mod);

  return target.map((skill) => {
    const thisModification = skill.trackModifications.find(
      (modification) => modification.id === modId,
    );

    if (!thisModification) {
      return skill;
    }

    if (!hasValueProperty(thisModification)) {
      devConsoleWarn(
        "The Mod already Present when removing value to all not proficient skills must have a value property",
        thisModification,
      );
      return skill;
    }

    return {
      ...skill,
      currentScore: skill.currentScore - thisModification.value,
      trackModifications: removeFromTrackModificationsById(skill, modId),
    };
  });
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

const onRemovingValueToSkill = onRemovingValueToFeature<SkillProp>;

export const abilityAndSkillTypeResolver: AbilityAndSkillTypeResolver = {
  //changeAbilityReference: { apply: onSetAbility, revert: onSetAbility },
  addAbility: { apply: onAddingAbility, revert: onRemovingAbility },
  addAbilityToSkill: {
    apply: onAddingAbilityToSkill,
    revert: onRemovingAbilityToSkill,
  },
  addAdvantage: { apply: onAddingAdvantage, revert: onRemovingAdvantage },
  setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility: {
    apply: onSettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility,
    revert: onUnsettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility,
  },

  addValueToAllNotProficientSkills: {
    apply: onAddingValueToAllNotProficientSkills,
    revert: onRemovingValueToAllNotProficientSkills,
  },
  addValueToAbility: {
    apply: onAddingValueToAbility,
    revert: onRemovingValueToAbility,
  },
  addValueToSkill: {
    apply: onAddingValueToSkill,
    revert: onRemovingValueToSkill,
  },
};
