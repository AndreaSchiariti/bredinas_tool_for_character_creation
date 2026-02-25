import type { Character } from "../../types/character.types/character.types";
import type { ClassChoiceFeatures, AllClassChoicesSelection } from "../../types/features.types/classes";
import type { ItemType, WeaponInterface } from "../../types/features.types/items.type";
import { devConsoleWarn } from "../../utils/general";


export interface LimitationsMap {
  notEquippingOnlyunarmedOrSimpleAndMartialMeleeWithLight: boolean;
  wearingArmor: boolean;
  isEquippingShield: boolean;
  isIncapacitated: boolean;
  isNotEnraged: boolean;
  wearingHeavyArmor: boolean;
  choseDivineOrderProtector: boolean;
  choseDivineOrderThaumaturge: boolean;
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

function isClassChoice(
  character: Character,
  classChoiceFeature: ClassChoiceFeatures,
  selected: AllClassChoicesSelection,
) {
  return character.classes.some((characterClass) =>
    characterClass.classChoices
      ? characterClass.classChoices
        ? characterClass.classChoices[classChoiceFeature] === selected
        : false
      : false,
  );
}

function choseDivineOrderProtector(character: Character): boolean {
  return isClassChoice(character, "divineOrder", "protector");
}

function choseDivineOrderThaumaturge(character: Character): boolean {
  return isClassChoice(character, "divineOrder", "thaumaturge");
}

export const limitationsResolver: LimitationsResolver = {
  notEquippingOnlyunarmedOrSimpleAndMartialMeleeWithLight:
    isUnarmedOrLightSimpleAndMartialWeapon,
  wearingArmor: isWearingArmor,
  isEquippingShield: isEquippingShield,
  isIncapacitated: isIncapacitated,
  isNotEnraged: isNotEnraged,
  wearingHeavyArmor: isWearingHeavyArmor,
  choseDivineOrderProtector: choseDivineOrderProtector,
  choseDivineOrderThaumaturge: choseDivineOrderThaumaturge,
};
