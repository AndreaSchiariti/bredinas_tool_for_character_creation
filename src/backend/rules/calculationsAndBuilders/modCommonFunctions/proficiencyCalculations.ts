import type { WeaponProficiencyInterface } from "../../../types/character.types/characterUtils.type";
import type { CoreWeaponProficiency } from "../../../types/features.types/items.type";
import type { Level } from "../../../types/generalRules.types/levels.types";
import { hasWeaponProficiencyProperty } from "../../../types/guardingFunctions/trackModificationsGuards";
import type { TrackModifications } from "../../../types/modifications.types/trackModifications.types";

export function calculateProficiency(level: Level): number {
  if (level >= 17) {
    return 6;
  } else if (level >= 13) {
    return 5;
  } else if (level >= 9) {
    return 4;
  } else if (level >= 5) {
    return 3;
  } else {
    return 2;
  }
}

export function addWeaponProficiency(
  proficiency: WeaponProficiencyInterface,
  weaponType: CoreWeaponProficiency,
): WeaponProficiencyInterface {
  if (weaponType === "allMartial") {
    return {
      ...proficiency,
      martial: {
        ammunition: true,
        finesse: true,
        heavy: true,
        light: true,
        loading: true,
        range: true,
        reach: true,
        thrown: true,
        twoHanded: true,
        versatile: true,
      },
    };
  }

  if (weaponType === "simple") {
    return {
      ...proficiency,
      simple: true,
    };
  }

  return {
    ...proficiency,
    martial: { ...proficiency.martial, [weaponType]: true },
  };
}

export function refactorWeaponProficiencyBasedOnTrackModifications(
  trackModifications: TrackModifications[],
): WeaponProficiencyInterface {
  let updatedProficiency: WeaponProficiencyInterface = {
    simple: false,
    martial: {
      ammunition: false,
      finesse: false,
      heavy: false,
      light: false,
      loading: false,
      range: false,
      reach: false,
      thrown: false,
      twoHanded: false,
      versatile: false,
    },
    trackModifications: trackModifications,
  };

  const proficienciesToReassign: CoreWeaponProficiency[] =
    trackModifications.reduce((acc: CoreWeaponProficiency[], mod) => {
      if (!hasWeaponProficiencyProperty(mod)) {
        return acc;
      }

      return [...acc, mod.weaponProficiency];
    }, []);

  for (const proficiency of proficienciesToReassign) {
    updatedProficiency = addWeaponProficiency(updatedProficiency, proficiency);
  }

  return updatedProficiency;
}