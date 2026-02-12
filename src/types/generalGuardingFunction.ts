import {
  conditionalTargetSet,
  type ConditionalTargetMap,
} from "../rules/conditionalTargetResolver";
import {
  directTargetSet,
  type DirectTargetMap,
} from "../rules/directTargetResolver";
import { type DiceInterface, isDiceInterface } from "./generalRules.types";
import type { TargetInterface } from "./targets.types";
import type { TrackModifications, TrackModificationWithDice, TrackModificationWithValue } from "./trackModifications.types";

export function makeStringGuard<T extends string>(set: ReadonlySet<T>) {
  return (value: unknown): value is T =>
    typeof value === "string" && set.has(value as T);
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

export interface ModHasDiceProperty {
  dice: DiceInterface;
}

export interface HasValueProperty { value: number };

export function hasValueProperty(data: TrackModifications): data is TrackModificationWithValue
export function hasValueProperty(data: unknown): data is HasValueProperty
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


export function hasDiceProperty(data: TrackModifications): data is TrackModificationWithDice
export function hasDiceProperty(data: unknown): data is ModHasDiceProperty
export function hasDiceProperty(data: unknown): boolean {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const object = data as {
    dice?: unknown;
  };

  return isDiceInterface(object.dice);
}