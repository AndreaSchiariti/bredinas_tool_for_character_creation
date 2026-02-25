import type { Character } from "../../../types/character.types/character.types";
import type {
  CharacterArmorClass,
  WeaponProficiencyInterface,
} from "../../../types/character.types/characterUtils.type";
import type { SkillProp } from "../../../types/features.types/abilitiesAndSkills.type";
import { hasArmorTypeProperty } from "../../../types/guardingFunctions/trackModificationsGuards";
import type { ModificationsProp } from "../../../types/modifications.types/ModificationProps.type";
import type { TrackModifications } from "../../../types/modifications.types/trackModifications.types";
import { getModificationId, removeFromTrackModificationsByMod, removeFromTrackModificationsById } from "../../calculationsAndBuilders/idBuilder";
import { modificationIsApplied, relatedModStillActive } from "../../calculationsAndBuilders/modCommonFunctions/generalModFunctions";
import { addProficiencySet } from "../../calculationsAndBuilders/modCommonFunctions/modSets";
import { addWeaponProficiency, refactorWeaponProficiencyBasedOnTrackModifications } from "../../calculationsAndBuilders/modCommonFunctions/proficiencyCalculations";
import type { ModificationTypeResolver } from "../modificationTypeResolver";



type ProficiencyTypeResolver = Pick<
  ModificationTypeResolver,
  "addProficiency" | "addProficiencyToArmor" | "addProficiencyToWeapon"
>;

function onAddingProficiency(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addProficiency" }>,
): SkillProp[] {
  const proficienciesSet = new Set(mod.addProficiencyTo);

  const modId = getModificationId(mod);

  return target.map((skill) => {
    if (!proficienciesSet.has(skill.name)) {
      return skill;
    }

    const alreadyAdded = modificationIsApplied(skill.trackModifications, modId);

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
  });
}

function onRemovingProficiency(
  _character: Character,
  target: SkillProp[],
  mod: Extract<ModificationsProp, { type: "addProficiency" }>,
): SkillProp[] {
  const proficienciesSet = new Set(mod.addProficiencyTo);

  return target.map((skill) => {
    if (!proficienciesSet.has(skill.name)) {
      return skill;
    }

    const updatedTrackModifications = removeFromTrackModificationsByMod(
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
  });
}

function onAddingProficiencyToArmor(
  _character: Character,
  target: CharacterArmorClass,
  mod: Extract<ModificationsProp, { type: "addProficiencyToArmor" }>,
): CharacterArmorClass {
  const modId = getModificationId(mod);

  if (modificationIsApplied(target.trackModifications, modId)) {
    return target;
  }

  const thisModification: Extract<
    TrackModifications,
    { type: "addProficiencyToArmor" }
  > = {
    name: mod.name,
    id: modId,
    type: mod.type,
    source: mod.source,
    armorType: mod.armorType,
  };
  return {
    ...target,
    proficient: { ...target.proficient, [mod.armorType]: true },
    trackModifications: [...target.trackModifications, thisModification],
  };
}

function onRemovingProficiencyToArmor(
  _character: Character,
  target: CharacterArmorClass,
  mod: Extract<ModificationsProp, { type: "addProficiencyToArmor" }>,
): CharacterArmorClass {
  const modId = getModificationId(mod);

  if (!modificationIsApplied(target.trackModifications, modId)) {
    return target;
  }

  const updatedTrackModifications = removeFromTrackModificationsById(
    target,
    modId,
  );

  const stillApplied = updatedTrackModifications.some(
    (modification) =>
      hasArmorTypeProperty(modification) &&
      modification.armorType === mod.armorType,
  );

  return {
    ...target,
    proficient: { ...target.proficient, [mod.armorType]: stillApplied },
    trackModifications: updatedTrackModifications,
  };
}

function onAddingProficiencyToWeapon(
  _character: Character,
  target: WeaponProficiencyInterface,
  mod: Extract<ModificationsProp, { type: "addProficiencyToWeapon" }>,
): WeaponProficiencyInterface {
  const modId = getModificationId(mod);

  if (modificationIsApplied(target.trackModifications, modId)) {
    return target;
  }

  const thisModification: Extract<
    TrackModifications,
    { type: "addProficiencyToWeapon" }
  > = {
    name: mod.name,
    type: mod.type,
    id: modId,
    source: mod.source,
    weaponProficiency: mod.weaponProficiency,
  };

  return {
    ...addWeaponProficiency(target, mod.weaponProficiency),
    trackModifications: [...target.trackModifications, thisModification],
  };
}

function onRemovingProficiencyToWeapon(
  _character: Character,
  target: WeaponProficiencyInterface,
  mod: Extract<ModificationsProp, { type: "addProficiencyToWeapon" }>,
): WeaponProficiencyInterface {
  const modId = getModificationId(mod);

  if (!modificationIsApplied(target.trackModifications, modId)) {
    return target;
  }

  const updatedTrackModifications = removeFromTrackModificationsById(
    target,
    modId,
  );

  return refactorWeaponProficiencyBasedOnTrackModifications(
    updatedTrackModifications,
  );
}

export const proficiencyTypeResolver: ProficiencyTypeResolver = {
  addProficiency: { apply: onAddingProficiency, revert: onRemovingProficiency },
  addProficiencyToArmor: {
    apply: onAddingProficiencyToArmor,
    revert: onRemovingProficiencyToArmor,
  },
  addProficiencyToWeapon: {
    apply: onAddingProficiencyToWeapon,
    revert: onRemovingProficiencyToWeapon,
  },
};
