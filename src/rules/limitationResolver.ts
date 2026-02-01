import type { Character } from "../types/character.types";
import type { ItemType, WeaponInterface } from "../types/items.types";

export interface LimitationsMap {
  unarmedOrSimpleAndMartialMeleeWithLight: boolean;
  notWearingArmor: boolean;
  notEquippedShield: boolean;
  notIncapacitated: boolean;
}

type LimitationsResolver = {
  [K in keyof LimitationsMap]: (character: Character) => LimitationsMap[K];
};

//Checks if the Type of the equipped items is a weapon
function isWeapon(
  item: ItemType | null,
): item is WeaponInterface {
  return !!item && "properties" in item;
}

function isLight(weapon: WeaponInterface | null): boolean {
  return !!weapon && weapon.properties.includes("light");
}

//The Character is unarmed or is equipping only weapons with light properties
function isUnarmedOrLightSimpleAndMartialWeapon(character: Character): boolean {
  const { mainHand, offHand } = character.equipped;

  if (!mainHand && !offHand) {
    return true;
  }

  if (isWeapon(mainHand) && (!offHand || isWeapon(offHand))) {
    if (!isLight(mainHand)) {
      return false;
    }

    if (offHand && !isLight(offHand)) {
      return false;
    }

    return true;
  }

  return false;
}

function isNotWearingArmor(character: Character) {
  const { isWearingLightArmor, isWearingMediumArmor, isWearingHeavyArmor } =
    character.armorClass;

  return !(isWearingLightArmor || isWearingMediumArmor || isWearingHeavyArmor);
}

function isNotequippingShield(character: Character) {
  return !character.armorClass.isShieldEquipped;
}

function isNotIncapacitated(character: Character) {
   return !character.conditions.conditionsList.incapacitated.isAffecting
}

export const limitationsResolver: LimitationsResolver = {
  unarmedOrSimpleAndMartialMeleeWithLight:
    isUnarmedOrLightSimpleAndMartialWeapon,
  notWearingArmor: isNotWearingArmor,
  notEquippedShield: isNotequippingShield,
  notIncapacitated: isNotIncapacitated
};
