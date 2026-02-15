import type { Character } from "../../types/character.types";
import type {
  TrackModifications,
  TrackModificationWithValue,
} from "../../types/trackModifications.types";
import type { ModificationsProp } from "../../types/ModificationProps.type";
import { type HasAbilitiesWithTracking } from "../../types/targets.types";
import {
  getModificationId,
  removeFromTrackModificationsById,
} from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";
import type { CharacterSkills } from "../../types/features.type.ts/abilitiesAndSkills.type";
import {
  relatedModStillActive,
  addAdvantageSet,
  addProficiencySet,
  modificationIsApplied,
  setMinimumTotalSet,
  addExpertiseSet,
  calculateModifyValue,
} from "../characterCalculations";
import { devConsoleWarn, removeFromArrayByIndex } from "../../utils/general";
import { getTarget } from "../modificationsExecution";
import {
  hasValueProperty,
  isTargetInterface,
} from "../../types/generalGuardingFunction";

type AbilityAndSkillTypeResolver = Pick<
  ModificationTypeResolver,
  | "addAbility"
  | "addAbilityToSkill"
  | "addProficiency"
  | "addProficiencyWithChoice"
  | "addAdvantage"
  | "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility"
  | "addExpertiseToProficiencyWithChoice"
  | "addValueToAllNotProficientSkills"
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
        abilities: [...target.abilities, mod.ability],
        trackModifications: newTrackModifications,
      };
}

function onAddingAbilityToSkill(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addAbilityToSkill" }>,
): CharacterSkills {
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

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
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
    }),
  };
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

  const index = target.abilities.findIndex(
    (ability) => ability === mod.ability,
  );

  const updatedTrackModifications = removeFromTrackModificationsById(
    target,
    mod,
  );

  if (index === -1) {
    return { ...target, trackModifications: updatedTrackModifications };
  }

  return {
    ...target,
    abilities: removeFromArrayByIndex(target.abilities, index),
    trackModifications: updatedTrackModifications,
  };
}

function onRemovingAbilityToSkill(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addAbilityToSkill" }>,
): CharacterSkills {
  const modId = getModificationId(mod);

  const toWhichSkillSet = new Set(mod.toWhichSkill);

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
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
        mod,
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
    }),
  };
}

function onAddingProficiency(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addProficiency" }>,
): CharacterSkills {
  const proficienciesSet = new Set(mod.addProficiencyTo);

  const modId = getModificationId(mod);

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
      if (!proficienciesSet.has(skill.name)) {
        return skill;
      }

      const alreadyAdded = modificationIsApplied(
        skill.trackModifications,
        modId,
      );

      return alreadyAdded
        ? skill
        : {
            ...skill,
            hasProficiency: true,
            trackModifications: [
              ...skill.trackModifications,
              {
                type: "addProficiency",
                name: mod.name,
                source: mod.source,
                id: modId,
              },
            ],
          };
    }),
  };
}

function onRemovingProficiency(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addProficiency" }>,
): CharacterSkills {
  const proficienciesSet = new Set(mod.addProficiencyTo);

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
      if (!proficienciesSet.has(skill.name)) {
        return skill;
      }

      const updatedTrackModifications = removeFromTrackModificationsById(
        skill,
        mod,
      );

      if (
        skill.gainedWithClass ||
        relatedModStillActive(updatedTrackModifications, addProficiencySet)
      ) {
        return { ...skill, trackModifications: updatedTrackModifications };
      }

      return {
        ...skill,
        hasProficiency: false,
        trackModifications: updatedTrackModifications,
      };
    }),
  };
}

function onAddingProficiencyWithChoice(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addProficiencyWithChoice" }>,
): CharacterSkills {
  const characterProficiencies = target.skillsList
    .filter((skill) => skill.hasProficiency)
    .map((skill) => skill.name);

  const characterProficienciesSet = new Set(characterProficiencies);

  const skillsToChoose = mod.skillsToChoose.filter(
    (skillName) => !characterProficienciesSet.has(skillName),
  );

  const message = skillsToChoose.length === 0 ? "alreadyProficient" : null;

  return {
    ...target,
    isAddingProficiency: {
      isShown: true,
      skillList: skillsToChoose,
      type: "proficiency",
      howMany: mod.howMany,
      message,
      modification: {
        name: mod.name,
        type: mod.type,
        id: getModificationId(mod),
        source: mod.source,
      },
    },
  };
}

function onRemovingProficiencyWithChoice(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addProficiencyWithChoice" }>,
): CharacterSkills {
  const proficiencyToRemoveSet = new Set(mod.skillsToChoose);

  const modId = getModificationId(mod);

  const shouldClosePicker =
    target.isAddingProficiency.isShown &&
    target.isAddingProficiency.modification.id === modId;

  const updatedSkillsList = target.skillsList.map((skill) => {
    if (
      !proficiencyToRemoveSet.has(skill.name) ||
      !skill.trackModifications.some(
        (modification) => modification.id === modId,
      )
    ) {
      return skill;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      skill,
      mod,
    );

    const stillProficient =
      relatedModStillActive(updatedTrackModifications, addProficiencySet) ||
      skill.gainedWithClass;

    return stillProficient
      ? { ...skill, trackModifications: updatedTrackModifications }
      : {
          ...skill,
          trackModifications: updatedTrackModifications,
          hasProficiency: false,
        };
  });

  return {
    ...target,
    skillsList: updatedSkillsList,
    isAddingProficiency: shouldClosePicker
      ? { isShown: false }
      : target.isAddingProficiency,
  };
}

function onAddingAdvantage(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addAdvantage" }>,
): CharacterSkills {
  const featuresSet = new Set(mod.features);

  const modId = getModificationId(mod);

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
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
    }),
  };
}

function onRemovingAdvantage(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addAdvantage" }>,
): CharacterSkills {
  const featureSet = new Set(mod.features);

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
      if (!featureSet.has(skill.name)) {
        return skill;
      }

      const updatedTrackModifications = removeFromTrackModificationsById(
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
    }),
  };
}

function onSettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility(
  character: Character,
  target: CharacterSkills,
  mod: Extract<
    ModificationsProp,
    { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
  >,
): CharacterSkills {
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

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
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
    }),
  };
}

function onUnsettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<
    ModificationsProp,
    { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
  >,
): CharacterSkills {
  const modId = getModificationId(mod);

  const abilityAffected = new Set(mod.skillsAbilityAffected);

  return {
    ...target,
    skillsList: target.skillsList.map((skill) => {
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
        mod,
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
    }),
  };
}

function onAddingExpertiseToProficiencyWithChoice(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<
    ModificationsProp,
    { type: "addExpertiseToProficiencyWithChoice" }
  >,
): CharacterSkills {
  const skillsToChoose = target.skillsList
    .filter((skill) => skill.hasProficiency && !skill.hasExpertise)
    .map((skill) => skill.name);

  const message = skillsToChoose.length === 0 ? "alreadyExpertise" : null;

  const thisModification: Extract<
    TrackModifications,
    { type: "addExpertiseToProficiencyWithChoice" }
  > = {
    name: mod.name,
    type: mod.type,
    id: getModificationId(mod),
    source: mod.source,
  };

  return {
    ...target,
    isAddingProficiency: {
      isShown: true,
      skillList: skillsToChoose,
      type: "expertise",
      howMany: mod.howMany,
      message,
      modification: thisModification,
    },
  };
}

function onRemovingExpertiseToProficiencyWithChoice(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<
    ModificationsProp,
    { type: "addExpertiseToProficiencyWithChoice" }
  >,
): CharacterSkills {
  const modId = getModificationId(mod);

  const shouldClosePicker =
    target.isAddingProficiency.isShown &&
    target.isAddingProficiency.modification.id === modId;

  const updatedSkillsList = target.skillsList.map((skill) => {
    if (
      !skill.trackModifications.some(
        (modification) => modification.id === modId,
      )
    ) {
      return skill;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      skill,
      mod,
    );

    const stillExpertise = relatedModStillActive(
      updatedTrackModifications,
      addExpertiseSet,
    );

    return stillExpertise
      ? { ...skill, trackModifications: updatedTrackModifications }
      : {
          ...skill,
          trackModifications: updatedTrackModifications,
          hasExpertise: false,
        };
  });

  return {
    ...target,
    skillsList: updatedSkillsList,
    isAddingProficiency: shouldClosePicker
      ? { isShown: false }
      : target.isAddingProficiency,
  };
}

function onAddingValueToAllNotProficientSkills(
  character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addValueToAllNotProficientSkills" }>,
): CharacterSkills {
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

  const updatedSkills = target.skillsList.map((skill) => {
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
        trackModifications: removeFromTrackModificationsById(skill, mod),
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

  return { ...target, skillsList: updatedSkills };
}

function onRemovingValueToAllNotProficientSkills(
  _character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addValueToAllNotProficientSkills" }>,
): CharacterSkills {
  const modId = getModificationId(mod);

  const updatedSkills = target.skillsList.map((skill) => {
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
      trackModifications: removeFromTrackModificationsById(skill, mod),
    };
  });

  return { ...target, skillsList: updatedSkills };
}

export const abilityAndSkillTypeResolver: AbilityAndSkillTypeResolver = {
  //changeAbilityReference: { apply: onSetAbility, revert: onSetAbility },
  addAbility: { apply: onAddingAbility, revert: onRemovingAbility },
  addAbilityToSkill: {
    apply: onAddingAbilityToSkill,
    revert: onRemovingAbilityToSkill,
  },
  addProficiency: { apply: onAddingProficiency, revert: onRemovingProficiency },
  addAdvantage: { apply: onAddingAdvantage, revert: onRemovingAdvantage },
  addProficiencyWithChoice: {
    apply: onAddingProficiencyWithChoice,
    revert: onRemovingProficiencyWithChoice,
  },
  setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility: {
    apply: onSettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility,
    revert: onUnsettingAbilityScoreAsMinimumTotalToSkillsBasedOnAbility,
  },
  addExpertiseToProficiencyWithChoice: {
    apply: onAddingExpertiseToProficiencyWithChoice,
    revert: onRemovingExpertiseToProficiencyWithChoice,
  },
  addValueToAllNotProficientSkills: {
    apply: onAddingValueToAllNotProficientSkills,
    revert: onRemovingValueToAllNotProficientSkills,
  },
};
