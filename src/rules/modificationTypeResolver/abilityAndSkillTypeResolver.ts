import type { Character } from "../../types/character.types";
import type { TrackModifications } from "../../types/trackModifications.types";
import type { SkillProp } from "../../types/characterUtils.type";
import type { ModificationsProp } from "../../types/ModificationProps.type";
import {
  hasAbilitiesWithTrackingProperty,
  type HasAbilitiesWithTracking,
} from "../../types/targets.types";
import { devConsoleWarn } from "../../utils/general";
import {
  getModificationId,
  removeFromTrackModificationsById,
} from "../idBuilder";
import type { ModificationTypeResolver } from "../modificationTypeResolver";

type AbilityAndSkillTypeResolver = Pick<
  ModificationTypeResolver,
  "addAbility" | "addProficiency"
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
): HasAbilitiesWithTracking{
  if (!hasAbilitiesWithTrackingProperty(target)) {
    devConsoleWarn(
      `Target for onAddingAbility has no abilities array or trackModifications`,
      mod,
    );
    return target;
  }

  const newTrackModifications: TrackModifications[] = [
    ...target.trackModifications,
    {
      name: mod.name,
      type: mod.type,
      ability: mod.ability,
      source: mod.source,
      id: getModificationId(mod),
    },
  ];

  return {
    ...target,
    abilities: [...target.abilities, mod.ability],
    trackModifications: newTrackModifications,
  };
}

function onRemovingAbility(
  _character: Character,
  target: HasAbilitiesWithTracking ,
  mod: Extract<ModificationsProp, { type: "addAbility" }>,
): HasAbilitiesWithTracking{
  if (!hasAbilitiesWithTrackingProperty(target)) {
    devConsoleWarn(
      `Target for onRemovingAbility has no abilities array or trackModifications`,
      mod,
    );
    return target;
  }
  const index = target.abilities.findIndex(
    (ability) => ability === mod.ability,
  );

  if (index === -1) {
    return target;
  }

  return {
    ...target,
    abilities: [
      ...target.abilities.slice(0, index),
      ...target.abilities.slice(index + 1),
    ],
    trackModifications: removeFromTrackModificationsById(target, mod),
  };
}

function onAddingProficiency(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addProficiency" }>,
): SkillProp[] {
  const updatedSkills = [...target];

  mod.addProficiencyTo.forEach((skillToFind) => {
    const skillIndex = updatedSkills.findIndex(
      (skill) => skill.name === skillToFind,
    );

    if (skillIndex === -1) {
      devConsoleWarn(
        `Name ${skillToFind} doesn't match any skill name, can't add Proficiency`,
        target,
      );
    } else {
      let skillToUpdate = updatedSkills[skillIndex];

      skillToUpdate = {
        ...skillToUpdate,
        hasProficiency: true,
        trackModifications: [
          ...skillToUpdate.trackModifications,
          {
            type: "addProficiency",
            name: mod.name,
            source: mod.source,
            id: getModificationId(mod),
          },
        ],
      };

      updatedSkills[skillIndex] = skillToUpdate;
    }
  });

  return updatedSkills;
}

function onRemovingProficiency(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addProficiency" }>,
): SkillProp[] {
  const updatedSkills = [...target];

  mod.addProficiencyTo.forEach((skillToFind) => {
    const skillIndex = updatedSkills.findIndex(
      (skill) => skill.name === skillToFind,
    );

    if (skillIndex === -1) {
      devConsoleWarn(
        `Name ${skillToFind} doesn't match any skill name, can't remove Proficiency`,
        target,
      );
    } else {
      let skillToUpdate = updatedSkills[skillIndex];

      skillToUpdate = {
        ...skillToUpdate,
        trackModifications: removeFromTrackModificationsById(
          skillToUpdate,
          mod,
        ),
      };

      if (
        !skillToUpdate.gainedWithClass &&
        !skillToUpdate.trackModifications.some(
          (modification) => modification.type === mod.type,
        )
      ) {
        skillToUpdate = { ...skillToUpdate, hasProficiency: false };
      }

      updatedSkills[skillIndex] = skillToUpdate;
    }
  });

  return updatedSkills;
}

export const abilityAndSkillTypeResolver: AbilityAndSkillTypeResolver = {
  //changeAbilityReference: { apply: onSetAbility, revert: onSetAbility },
  addAbility: { apply: onAddingAbility, revert: onRemovingAbility },
  addProficiency: { apply: onAddingProficiency, revert: onRemovingProficiency },
};
