import {
  choosingClassFeaturesSet,
  type ClassChoiceFeatures,
} from "../features.types/classes";
import {
  type ArmorType,
  armorTypeSet,
  type CoreWeaponProficiency,
  coreWeaponProficiencySet,
} from "../features.types/items.type";
import type { DiceInterface } from "../generalRules.types/dice.types";
import {
  type TrackModifications,
  trackModificationsTypeSet,
} from "../modifications.types/trackModifications.types";
import { isDiceInterface } from "./generalFeaturesGuards";

export interface HasTrackModifications {
  trackModifications: TrackModifications[];
}

export function isTrackModifications(
  object: unknown,
): object is TrackModifications {
  if (typeof object !== "object" || object === null) {
    return false;
  }

  const mod = object as {
    name?: unknown;
    id?: unknown;
    source?: unknown;
    type?: unknown;
  };

  return (
    typeof mod.name === "string" &&
    typeof mod.id === "string" &&
    typeof mod.source === "string" &&
    typeof mod.type === "string" &&
    trackModificationsTypeSet.has(mod.type as TrackModifications["type"])
  );
}

export interface HasValueProperty {
  value: number;
}

export type TrackModificationWithValue = Extract<
  TrackModifications,
  HasValueProperty
>;

export function hasValueProperty(
  data: TrackModifications,
): data is TrackModificationWithValue;
export function hasValueProperty(data: unknown): data is HasValueProperty;
export function hasValueProperty(data: unknown): boolean {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const element = data as {
    value?: unknown;
  };

  const hasValue = typeof element.value === "number";

  return hasValue;
}

export interface HasDiceProperty {
  dice: DiceInterface;
}

export type TrackModificationWithDice = Extract<
  TrackModifications,
  HasDiceProperty
>;

export function hasDiceProperty(
  data: TrackModifications,
): data is TrackModificationWithDice;
export function hasDiceProperty(data: unknown): data is HasDiceProperty;
export function hasDiceProperty(data: unknown): boolean {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const object = data as {
    dice?: unknown;
  };

  return isDiceInterface(object.dice);
}

export function isChoosingClassFeature(
  data: unknown,
): data is ClassChoiceFeatures {
  if (data === null || typeof data !== "string") {
    return false;
  }

  return choosingClassFeaturesSet.has(data as ClassChoiceFeatures);
}

export type HasArmorTypeProperty = { armorType: ArmorType };

export type TrackModificationWithArmorType = Extract<
  TrackModifications,
  HasArmorTypeProperty
>;

export function hasArmorTypeProperty(
  data: TrackModifications,
): data is TrackModificationWithArmorType;
export function hasArmorTypeProperty(
  data: unknown,
): data is HasArmorTypeProperty;
export function hasArmorTypeProperty(data: unknown): boolean {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const object = data as {
    armorType: unknown;
  };

  return (
    typeof object.armorType === "string" &&
    armorTypeSet.has(object.armorType as ArmorType)
  );
}

export type HasWeaponProficiencyProperty = {
  weaponProficiency: CoreWeaponProficiency;
};

export type TrackModificationWithWeaponProficiency = Extract<
  TrackModifications,
  HasWeaponProficiencyProperty
>;

export function hasWeaponProficiencyProperty(
  data: TrackModifications,
): data is TrackModificationWithWeaponProficiency;
export function hasWeaponProficiencyProperty(
  data: unknown,
): data is HasWeaponProficiencyProperty;
export function hasWeaponProficiencyProperty(data: unknown): boolean {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const object = data as {
    weaponProficiency: unknown;
  };

  return (
    typeof object.weaponProficiency === "string" &&
    coreWeaponProficiencySet.has(
      object.weaponProficiency as CoreWeaponProficiency,
    )
  );
}

export interface HasQuantityProperty {
  quantity: number;
}

export type TrackModificationWithQuantity = Extract<
  TrackModifications,
  HasQuantityProperty
>;

export function hasQuantityProperty(
  data: TrackModifications,
): data is TrackModificationWithQuantity;
export function hasQuantityProperty(data: unknown): data is HasQuantityProperty;
export function hasQuantityProperty(data: unknown): boolean {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const object = data as {
    quantity?: unknown;
  };

  return typeof object.quantity === "number";
}
