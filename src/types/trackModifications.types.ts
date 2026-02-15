import type { LimitationsMap } from "../rules/limitationResolver";
import type { DirectTargetMap } from "../rules/directTargetResolver";
import type { ModificationTypeMap } from "../rules/modificationTypeResolver";
import type { WeaponProperty } from "./items.types";
import type { ConditionalTargetMap } from "../rules/conditionalTargetResolver";
import { type DiceInterface } from "./generalRules.types";
import type { Ability } from "./features.type.ts/abilitiesAndSkills.type";
import type { Condition } from "./features.type.ts/conditions.type";
import type { DamageTypes } from "./features.type.ts/damageTypes.type";
import type { CharacterClassesName } from "./features.type.ts/classes.type";

export type ModificationTarget =
  | keyof DirectTargetMap
  | keyof ConditionalTargetMap;

export type ModificationTargetValue = DirectTargetMap[keyof DirectTargetMap];

export type ModificationOperation = keyof ModificationTypeMap;

export type ModificationLimitation = keyof LimitationsMap;

interface HasAbility extends BaseTrackModifications {
  ability: Ability;
}

export type Source = CharacterClassesName | Condition;

interface BaseTrackModifications {
  name: string;
  id: string;
  source: string;
}

interface HasValueModifications extends BaseTrackModifications {
  value: number
}

interface hasDiceModifications extends BaseTrackModifications {
  dice: DiceInterface;
}

interface ChangeDiceTrackModifications extends hasDiceModifications {
  type: "changeDice";
}

interface ChangeDiceBasedOnLevelTrackModification extends hasDiceModifications {
  type: "changeDiceBasedOnLevel";
}

interface ChangingAbilityModification extends HasAbility {
  type: "changeAbilityReference";
}

interface AddAbilityModification extends HasAbility {
  type: "addAbility";
}

interface AddAbilityToSkillModification extends HasAbility {
  type: "addAbilityToSkill";
}

interface AddValueModification extends HasValueModifications {
  type: "addValue";
}

interface AddValueToAbilityModification extends HasValueModifications {
  type: "addValueToAbility";
}

interface AddValueToSkillModification extends HasValueModifications {
  type: "addValueToSkill";
}

interface AddValueBasedOnLevelModification extends HasValueModifications {
  type: "addValueBasedOnLevel";
}

interface AddDamageTypeModification extends BaseTrackModifications {
  type: "addDamageType";
  damageType: DamageTypes;
}

interface AddProficiencyModification extends BaseTrackModifications {
  type: "addProficiency";
}

interface AddWeaponMasteryBasedOnLevelModification extends HasValueModifications {
  type: "addWeaponMasteryBasedOnLevel";
}

interface AddResistanceEventModification extends BaseTrackModifications {
  type: "addResistanceEvent";
}

interface IncreaseMaxLimitModification extends BaseTrackModifications {
  type: "increaseMaxLimit";
  newMaxValue: number;
}

interface ActivateConditionEventModification extends BaseTrackModifications {
  type: "activateConditionEvent";
}

interface AddResistanceConditionEventModification extends BaseTrackModifications {
  type: "addResistanceConditionEvent";
}

interface AddValueToAttacksBasedOnAbilityConditionEventModification extends HasValueModifications {
  type: "addValueToAttacksBasedOnAbilityConditionEvent";
}

interface StopConcentrationAndSpellcastingConditionEventModification extends BaseTrackModifications {
  type: "stopConcentrationAndSpellcastingConditionEvent";
}

interface AddAdvantageModification extends BaseTrackModifications {
  type: "addAdvantage";
}

interface AddAdvantageEventModification extends BaseTrackModifications {
  type: "addAdvantageEvent";
}

interface AddProficiencyWithChoiceModification extends BaseTrackModifications {
  type: "addProficiencyWithChoice";
}

 interface addFetchedScoreEventModification extends HasValueModifications {
   type: "addFetchedScoreEvent";
 }

 interface addDiceToAttackBasedOnAbilityEventModification extends hasDiceModifications {
   type: "addDiceToAttackBasedOnAbilityEvent";
 }

 interface SetAbilityScoreAsMinimumTotalToSkillsBasedOnAbilityModification extends HasValueModifications {
   type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility";
 }

 interface AddExpertiseToProficiencynWithChoiceModification extends BaseTrackModifications {
   type: "addExpertiseToProficiencyWithChoice";
 }

 interface AddValueToAllNotProficientSkills extends HasValueModifications {
   type: "addValueToAllNotProficientSkills";
 } 

export type TrackModifications =
  | ChangeDiceTrackModifications
  | ChangingAbilityModification
  | AddAbilityModification
  | AddAbilityToSkillModification
  | AddValueModification
  | AddValueToAbilityModification
  | AddValueToSkillModification
  | AddValueBasedOnLevelModification
  | AddDamageTypeModification
  | AddProficiencyModification
  | ChangeDiceBasedOnLevelTrackModification
  | AddResistanceEventModification
  | IncreaseMaxLimitModification
  | AddWeaponMasteryBasedOnLevelModification
  | ActivateConditionEventModification
  | AddResistanceConditionEventModification
  | AddValueToAttacksBasedOnAbilityConditionEventModification
  | StopConcentrationAndSpellcastingConditionEventModification
  | AddAdvantageModification
  | AddAdvantageEventModification
  | AddProficiencyWithChoiceModification
  | addFetchedScoreEventModification
  | addDiceToAttackBasedOnAbilityEventModification
  | SetAbilityScoreAsMinimumTotalToSkillsBasedOnAbilityModification
  | AddExpertiseToProficiencynWithChoiceModification
  | AddValueToAllNotProficientSkills

const trackModificationsTypeSet = new Set<TrackModifications["type"]>([
  "addAbility",
  "addAbilityToSkill",
  "addDamageType",
  "addValue",
  "addValueToAbility",
  "addValueToSkill",
  "addValueBasedOnLevel",
  "changeAbilityReference",
  "changeDice",
  "addProficiency",
  "changeDiceBasedOnLevel",
  "addResistanceEvent",
  "increaseMaxLimit",
  "addWeaponMasteryBasedOnLevel",
  "activateConditionEvent",
  "addResistanceConditionEvent",
  "stopConcentrationAndSpellcastingConditionEvent",
  "addAdvantage",
  "addAdvantageEvent",
  "addProficiencyWithChoice",
  "addFetchedScoreEvent",
  "addDiceToAttackBasedOnAbilityEvent",
  "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility",
  "addExpertiseToProficiencyWithChoice",
  "addValueToAllNotProficientSkills",
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

export type TrackModificationWithValue = Extract<TrackModifications, {value: number}>

export type TrackModificationWithDice = Extract<TrackModifications, {dice: DiceInterface}>

