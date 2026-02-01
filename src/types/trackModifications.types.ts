import type { LimitationsMap } from "../rules/limitationResolver";
import type { DirectTargetMap } from "../rules/directTargetResolver";
import type { ModificationTypeMap } from "../rules/modificationTypeResolver";
import type { WeaponProperty } from "./items.types";
import type { ConditionalTargetMap } from "../rules/conditionalTargetResolver";
import type { DiceInterface } from "./generalRules.types";
import type { Ability, DamageTypes } from "../rules/arrayOfFeatures";

export type ModificationTarget =
  | keyof DirectTargetMap
  | keyof ConditionalTargetMap;

export type ModificationTargetValue = DirectTargetMap[keyof DirectTargetMap];

export type ModificationOperation = keyof ModificationTypeMap;

export type ModificationLimitation = keyof LimitationsMap;

interface HasAbility {
  ability: Ability;
}

interface BaseTrackModifications {
  name: string;
  id: string;
  source: string;
}

export interface ChangeDiceTrackModifications extends BaseTrackModifications {
  type: "changeDice";
  dice: DiceInterface;
}

export interface ChangeDiceBasedOnLevelTrackModification extends BaseTrackModifications {
  type: "changeDiceBasedOnLevel",
  dice: DiceInterface
}

export interface SettingAbilityModification
  extends BaseTrackModifications, HasAbility {
  type: "changeAbilityReference";
}

export interface AddAbilityModification
  extends BaseTrackModifications, HasAbility {
  type: "addAbility";
}

export interface AddValueModification extends BaseTrackModifications {
  type: "addValue";
  value: number;
}

export interface AddValueBasedOnLevelModification extends BaseTrackModifications {
  type: "addValueBasedOnLevel";
  value: number
}

export interface AddDamageTypeModification extends BaseTrackModifications {
  type: "addDamageType";
  damageType: DamageTypes;
}

export interface AddProficiencyModification extends BaseTrackModifications {
  type: "addProficiency";
}

export type TrackModifications =
  | ChangeDiceTrackModifications
  | SettingAbilityModification
  | AddAbilityModification
  | AddValueModification
  | AddValueBasedOnLevelModification
  | AddDamageTypeModification
  | AddProficiencyModification
  | ChangeDiceBasedOnLevelTrackModification;

const trackModificationsTypeSet = new Set<TrackModifications["type"]>([
  "addAbility",
  "addDamageType",
  "addValue",
  "changeAbilityReference",
  "changeDice",
  "addProficiency",
  "changeDiceBasedOnLevel"
]);

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

export interface HasTrackModifications {
  trackModifications: TrackModifications[];
}

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
