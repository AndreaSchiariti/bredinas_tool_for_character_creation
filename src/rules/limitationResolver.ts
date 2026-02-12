import type { Character } from "../types/character.types";
import type { ItemType, WeaponInterface } from "../types/items.types";
import { devConsoleWarn } from "../utils/general";

export interface LimitationsMap {
  notEquippingOnlyunarmedOrSimpleAndMartialMeleeWithLight: boolean;
  wearingArmor: boolean;
  isEquippingShield: boolean;
  isIncapacitated: boolean;
  isNotEnraged: boolean;
  wearingHeavyArmor: boolean;
}

type LimitationsResolver = {
  [K in keyof LimitationsMap]: (character: Character) => LimitationsMap[K];
};

//Checks if the Type of the equipped items is a weapon
function isWeapon(item: ItemType | null): item is WeaponInterface {
  return !!item && "properties" in item;
}

function isLight(weapon: WeaponInterface | null): boolean {
  return !!weapon && weapon.properties.includes("light");
}

//The Character is unarmed or is equipping only weapons with light properties
function isUnarmedOrLightSimpleAndMartialWeapon(character: Character): boolean {
  const { mainHand, offHand } = character.equipped;

  if (!mainHand && !offHand) {
    return false;
  }

  if (isWeapon(mainHand) && (!offHand || isWeapon(offHand))) {
    if (!isLight(mainHand)) {
      return true;
    }

    if (offHand && !isLight(offHand)) {
      return true;
    }

    

    return false;
  }

  return true;
}

function isWearingArmor(character: Character): boolean {
  const { isWearingLightArmor, isWearingMediumArmor, isWearingHeavyArmor } =
    character.armorClass;

  return isWearingLightArmor && isWearingMediumArmor && isWearingHeavyArmor;
}

function isEquippingShield(character: Character) {
  return character.armorClass.isShieldEquipped;
}

function isIncapacitated(character: Character): boolean {
  const incapacitated = character.conditions.conditionsList.find(
    (con) => con.name === "incapacitated",
  );

  if (!incapacitated) {
    devConsoleWarn(
      `Couldn't find incapacited in the condition array for the limitation`,
      character.conditions.conditionsList,
    );
    return true;
  }

  return incapacitated.isAffecting;
}

function isNotEnraged(character: Character): boolean {
  const enraged = character.conditions.conditionsList.find(
    (con) => con.name === "enraged",
  );

  if (!enraged) {
    devConsoleWarn(
      `Couldn't find enraged in the condition array for the limitation`,
      character.conditions.conditionsList,
    );
    return false;
  }

  return !enraged.isAffecting;
}

function isWearingHeavyArmor(character: Character): boolean {
  return character.armorClass.isWearingHeavyArmor;
}

export const limitationsResolver: LimitationsResolver = {
  notEquippingOnlyunarmedOrSimpleAndMartialMeleeWithLight:
    isUnarmedOrLightSimpleAndMartialWeapon,
  wearingArmor: isWearingArmor,
  isEquippingShield: isEquippingShield,
  isIncapacitated: isIncapacitated,
  isNotEnraged: isNotEnraged,
  wearingHeavyArmor: isWearingHeavyArmor,
};
