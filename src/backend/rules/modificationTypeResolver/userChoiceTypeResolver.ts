import type { Character } from "../../types/character.types/character.types";
import type { SkillProp } from "../../types/features.types/abilitiesAndSkills.type";
import type { CustomClassChoiceKey, CharacterClassesName, ClassChoiceFeatures } from "../../types/features.types/classes";
import type { Feat } from "../../types/features.types/feat.type";
import { isCustomChoosingClassFeature } from "../../types/guardingFunctions/generalFeaturesGuards";
import { isChoosingClassFeature } from "../../types/guardingFunctions/trackModificationsGuards";
import type { ModificationsProp } from "../../types/modifications.types/ModificationProps.type";
import type { RuleClass } from "../../types/ruleClass.types/ruleClass.types";
import { devConsoleWarn, removeFromArrayByIndex } from "../../utils/general";
import  { getModificationId, removeFromTrackModificationsById } from "../calculationsAndBuilders/idBuilder";
import { modificationIsApplied, relatedModStillActive } from "../calculationsAndBuilders/modCommonFunctions/generalModFunctions";
import { addProficiencySet, addExpertiseSet } from "../calculationsAndBuilders/modCommonFunctions/modSets";
import type { ModificationTypeResolver } from "../modifications/modificationTypeResolver";

type UserChoiceTypeResolver = Pick<
  ModificationTypeResolver,
  | "addProficiencyWithChoice"
  | "addExpertiseToProficiencyWithChoice"
  | "addFeat"
  | "addClassChoice"
  | "addCustomClassChoice"
>;

function onAddingProficiencyWithChoice(
  _character: Character,
  target: SkillProp[],
  _mod: Extract<ModificationsProp, { type: "addProficiencyWithChoice" }>,
): SkillProp[] {
  return target;
}

function onRemovingProficiencyWithChoice(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addProficiencyWithChoice" }>,
): SkillProp[] {
  const proficiencyToRemoveSet = new Set(mod.chosenSkills ?? []);

  const modId = getModificationId(mod);

  return target.map((skill) => {
    if (
      !proficiencyToRemoveSet.has(skill.name) ||
      !modificationIsApplied(skill.trackModifications, modId)
    ) {
      return skill;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      skill,
      modId,
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
}

function onAddingExpertiseToProficiencyWithChoice(
  _character: Character,
  target: SkillProp[],
  _mod: Extract<
    ModificationsProp,
    { type: "addExpertiseToProficiencyWithChoice" }
  >,
): SkillProp[] {
  return target;
}

function onRemovingExpertiseToProficiencyWithChoice(
  _character: Character,
  target: SkillProp[],
  mod: Extract<
    ModificationsProp,
    { type: "addExpertiseToProficiencyWithChoice" }
  >,
): SkillProp[] {
  const modId = getModificationId(mod);
  const expertiseToRemoveSet = new Set(mod.chosenSkills ?? []);

  return target.map((skill) => {
    if (
      !modificationIsApplied(skill.trackModifications, modId) ||
      !expertiseToRemoveSet.has(skill.name)
    ) {
      return skill;
    }

    const updatedTrackModifications = removeFromTrackModificationsById(
      skill,
      modId,
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
}

function onAddingFeat(
  _character: Character,
  target: Feat[],
  _mod: Extract<ModificationsProp, { type: "addFeat" }>,
): Feat[] {
  return target;
}

function onRemovingFeat(
  _character: Character,
  target: Feat[],
  mod: Extract<ModificationsProp, { type: "addFeat" }>,
): Feat[] {
  const modId = getModificationId(mod);

  const featIndex = target.findIndex((feat) => feat.addedBy === modId);

  if (featIndex === -1) {
    devConsoleWarn(`Couldn't find the feat added by Id ${modId}`, target);
    return target;
  }

  return removeFromArrayByIndex(target, featIndex);
}

function onAddingClassChoice(
  _character: Character,
  target: RuleClass[],
  _mod: Extract<ModificationsProp, { type: "addClassChoice" }>,
): RuleClass[] {
  return target;
}

function onAddingCustomClassChoice(
  _character: Character,
  target: RuleClass[],
  _mod: Extract<ModificationsProp, { type: "addCustomClassChoice" }>,
): RuleClass[] {
  return target;
}

function removeClassChoice(
  characterClass: RuleClass,
  choiceKey: CustomClassChoiceKey,
  modClass: CharacterClassesName,
  type: "customClassChoices",
): RuleClass;
function removeClassChoice(
  characterClass: RuleClass,
  choiceKey: ClassChoiceFeatures,
  modClass: CharacterClassesName,
  type: "classChoices",
): RuleClass;
function removeClassChoice(
  characterClass: RuleClass,
  choiceKey: ClassChoiceFeatures | CustomClassChoiceKey,
  modClass: CharacterClassesName,
  type: "classChoices" | "customClassChoices",
): RuleClass {
  const classChoice = characterClass[type];

  if (!classChoice || typeof classChoice !== "object") {
    devConsoleWarn(
      `Couldn't find the class choice ${choiceKey} in the ${modClass} class to remove the choice`,
      characterClass,
    );
    return characterClass;
  }

  if (!(choiceKey in classChoice)) {
    devConsoleWarn(
      `Couldn't find the class choice ${choiceKey} in the ${modClass} class to remove the choice`,
      characterClass,
    );
    return characterClass;
  }

  return {
    ...characterClass,
    [type]: { ...classChoice, [choiceKey]: undefined },
  };
}

function onRemovingClassChoice(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addClassChoice" }>,
): RuleClass[] {
  if (!isChoosingClassFeature(mod.choice.key)) {
    devConsoleWarn(`${mod.choice.key} is not a key in the classChoices`, mod);
    return target;
  }

  const choiceKey = mod.choice.key;

  return target.map((characterClass) => {
    if (characterClass.name !== mod.class) {
      return characterClass;
    }

    return removeClassChoice(
      characterClass,
      choiceKey,
      mod.class,
      "classChoices",
    );
  });
}

function onRemovingCustomClassChoice(
  _character: Character,
  target: RuleClass[],
  mod: Extract<ModificationsProp, { type: "addCustomClassChoice" }>,
): RuleClass[] {
  const updatedClasses = [...target];

  const classIndex = updatedClasses.findIndex(
    (characterClass) => characterClass.name === mod.class,
  );

  if (classIndex === -1) {
    devConsoleWarn(
      `Couldn't find the class ${mod.class} in che character`,
      updatedClasses,
    );
    return updatedClasses;
  }

  const classToUpdate = updatedClasses[classIndex];

  if (!isCustomChoosingClassFeature(classToUpdate, mod.choice.key)) {
    devConsoleWarn(
      `${mod.choice.key} is not a key in the customClassChoices`,
      updatedClasses[classIndex],
    );
    return updatedClasses;
  }

  const choiceKey = mod.choice.key;

  updatedClasses[classIndex] = removeClassChoice(
    classToUpdate,
    choiceKey,
    mod.class,
    "customClassChoices",
  );

  return updatedClasses;
}

export const userChoiceTypeResolver: UserChoiceTypeResolver = {
  addProficiencyWithChoice: {
    apply: onAddingProficiencyWithChoice,
    revert: onRemovingProficiencyWithChoice,
  },
  addExpertiseToProficiencyWithChoice: {
    apply: onAddingExpertiseToProficiencyWithChoice,
    revert: onRemovingExpertiseToProficiencyWithChoice,
  },
  addFeat: { apply: onAddingFeat, revert: onRemovingFeat },
  addClassChoice: { apply: onAddingClassChoice, revert: onRemovingClassChoice },
  addCustomClassChoice: {
    apply: onAddingCustomClassChoice,
    revert: onRemovingCustomClassChoice,
  },
};
