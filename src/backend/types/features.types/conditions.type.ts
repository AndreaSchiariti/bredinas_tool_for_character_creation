import type { ConditionEventProp } from "../events.types/ConditionEventProp.type";
import { makeStringGuard } from "../guardingFunctions/stringGuards";
import { isTrackModifications } from "../guardingFunctions/trackModificationsGuards";
import {
  type TrackModifications,
} from "../modifications.types/trackModifications.types";

export const conditions = [
  "bardicInspiration",
  "charmed",
  "enraged",
  "frightened",
  "incapacitated",
  "poisoned",
] as const;

export type Condition = (typeof conditions)[number];

const conditionsSet = new Set<Condition>(conditions);

interface ConditionBase {
  name: Condition;
  events: ConditionEventProp[];
  trackModifications: TrackModifications[];
}

export type ConditionImmunity =
  | { isAffecting: boolean; isImmune: false }
  | { isAffecting: false; isImmune: true };

export type ConditionProp = ConditionBase & ConditionImmunity;

export interface IsCuringCondition {
  isShown: boolean;
  conditionsToCure: Condition[];
}
export interface CharacterConditions {
  conditionsList: ConditionProp[];
  isCuringCondition: IsCuringCondition;
}

export const isCondition = makeStringGuard<Condition>(conditionsSet);

export function isConditionProp(data: unknown): data is ConditionProp {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const condition = data as {
    name?: unknown;
    trackModification?: unknown;
    isAffection?: unknown;
    isImmune?: unknown;
  };

  const hasName =
    typeof condition.name === "string" && isCondition(condition.name);

  const hasTrackModifications =
    Array.isArray(condition.trackModification) &&
    condition.trackModification.every(isTrackModifications);

  const hasAffectionOrImmune =
    typeof condition.isAffection === "boolean" &&
    typeof condition.isImmune === "boolean";

  return hasName && hasTrackModifications && hasAffectionOrImmune;
}

export function hasIsCuringConditionProperty(
  object: unknown,
): object is IsCuringCondition {
  if (typeof object !== "object" || object === null) {
    return false;
  }

  const isCuring = object as {
    isShown?: unknown;
    conditionToCure?: unknown;
  };

  return (
    typeof isCuring.isShown === "boolean" &&
    Array.isArray(isCuring.conditionToCure) &&
    isCuring.conditionToCure.every(isCondition)
  );
}
