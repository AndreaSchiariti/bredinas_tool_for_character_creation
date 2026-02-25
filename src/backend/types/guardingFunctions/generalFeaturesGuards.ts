import { conditionalTargetSet, type ConditionalTargetMap } from "../../rules/target/conditionalTargetResolver";
import { directTargetSet, type DirectTargetMap } from "../../rules/target/directTargetResolver";
import type { CustomClassChoiceKey } from "../features.types/classes";
import type { WeaponProperty } from "../features.types/items.type";
import { type DiceInterface, diceFaceSet, type DiceFace } from "../generalRules.types/dice.types";
import type { Level } from "../generalRules.types/levels.types";
import type { RuleClass } from "../ruleClass.types/ruleClass.types";
import type { TargetInterface } from "../targets.types/targets.types";

export type HasWeaponProperties = {
  properties: WeaponProperty[];
};

export interface HasIsHealing {
  isHealing: boolean;
}

export interface HasCurrentQuantityAndMaxQuantity {
  currentQuantity: number;
  maxQuantity: number;
}


export function isDiceInterface(data: unknown): data is DiceInterface {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const dice = data as {
    face?: unknown;
    count?: unknown;
  };

  const hasFace =
    typeof dice.face === "number" && diceFaceSet.has(dice.face as DiceFace);
  const hasCount = typeof dice.count === "number";

  return hasFace && hasCount;
}

export function isLevel(value: unknown): value is Level {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 20
  );
}

export function isTargetInterface(data: unknown): data is TargetInterface {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const target = data as {
    target?: unknown;
    type?: unknown;
    condition?: unknown;
  };

  const isDirectTarget =
    typeof target.target === "string" &&
    directTargetSet.has(target.target as keyof DirectTargetMap) &&
    target.type === "direct";

  const isConditionalTarget =
    typeof target.target === "string" &&
    conditionalTargetSet.has(target.target as keyof ConditionalTargetMap) &&
    target.type === "conditional" &&
    typeof target.condition === "string";

  return isDirectTarget || isConditionalTarget;
}

export function isCustomChoosingClassFeature(
  characterClass: RuleClass,
  data: unknown,
): data is CustomClassChoiceKey {
  if (typeof data !== "string") {
    return false;
  }

  if (!characterClass.customClassChoices) {
    return false;
  }

  return data in characterClass.customClassChoices;
}