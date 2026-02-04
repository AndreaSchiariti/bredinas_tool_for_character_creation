import type {
  Ability,
  DamageTypes,
  FeatType,
  Replenish,
} from "../rules/arrayOfFeatures";
import type {
  CharacterClassesName,
  ClassFeatureDescription,
} from "./characterClassesUtils.types";
import type { ModificationLimitation } from "./trackModifications.types";
import type { SkillPropName } from "./characterUtils.type";
import type { EventCounterProp } from "./EventCounterProp.type";
import type { DiceInterface, Level, LevelKey } from "./generalRules.types";
import type { TargetInterface } from "./targets.types";

interface BaseModification {
  name: string;
  source: CharacterClassesName;
  targets: TargetInterface[];
  limitations: ModificationLimitation[];
  isActive: boolean;
}

export type DiceBasedOnLevel = Record<LevelKey, DiceInterface>;

export type ValueBasedOnLevel = Record<LevelKey, number>;

interface UsesDice extends BaseModification {
  dice: DiceInterface;
}

interface UsesUsagesAndReplanish extends BaseModification {
  usages: number;
  replenish: Replenish;
}

interface UsesDiceBasedOnLevel extends BaseModification {
  diceOnLevel: DiceBasedOnLevel;
  levelRef: TargetInterface;
}

interface UsesAbility {
  ability: Ability;
}

interface ChangeDiceMod extends UsesDice {
  type: "changeDice";
}

interface ChangeDiceBasedOnLevel extends UsesDiceBasedOnLevel {
  type: "changeDiceBasedOnLevel";
}

interface AddDiceCounter extends BaseModification, UsesDice {
  type: "addDiceCounter";
}

interface AddDiceBasedOnLevelCounter extends UsesDiceBasedOnLevel {
  type: "addDiceBasedOnLevelCounter";
}

interface AddDiceTrackerWithValuesCounter extends BaseModification {
  type: "addDiceTrackerWithValuesCounter";
  diceRollFetches: TargetInterface[];
  dice?: DiceInterface[];
  addValue?: number;
}

interface AddTracerCounter extends UsesUsagesAndReplanish {
  type: "addTracerCounter";
}

interface AddTracerTrackerCounter extends BaseModification {
  type: "addTracerTrackerCounter";
  replenish: Replenish;
  targetsToTrack: TargetInterface[];
}

interface AddEventCounterBase extends BaseModification {
  events: EventCounterProp[];
}

interface AddEventCounter
  extends BaseModification, UsesUsagesAndReplanish, AddEventCounterBase {
  type: "addEventCounter";
}

interface AddEventWithTriggerCounter extends AddEventCounterBase {
  type: "addEventWithTriggerCounter";
  trigger: string;
}

interface AddContinousEventWithTriggerCounter extends AddEventCounterBase {
  type: "addContinousEventWithTriggerCounter";
  trigger: string;
  areEventActive: boolean;
}

interface AddThrowingDiceEventTrackerCounter
  extends AddEventCounterBase, UsesUsagesAndReplanish {
  type: "addThrowingDiceEventTrackerCounter";
}

interface AddValueTrackerCounter extends BaseModification {
  type: "addValueTrackerCounter";
  valuesToTrack: TargetInterface[];
}

interface AddDifficultyClassCounter extends BaseModification, UsesAbility {
  type: "addDifficultyClassCounter";
}

interface AddTurnEconomy extends BaseModification {
  type: "addTurnEconomy";
  description: ClassFeatureDescription[];
}

interface ChangeDescriptionTurnEconomy extends BaseModification {
  type: "changeDescriptionTurnEconomy";
  description: ClassFeatureDescription[];
  originalDescription: ClassFeatureDescription[];
  actionId: string;
}

interface ChangeAbilityReference extends BaseModification {
  type: "changeAbilityReference";
  ability: Ability;
}

interface AddAbility extends BaseModification, UsesAbility {
  type: "addAbility";
}

interface AddValue extends BaseModification {
  type: "addValue";
  value: number;
}

export type FeatureWithName = Ability | SkillPropName;

interface AddValueToFeature extends BaseModification {
  value: number;
}

interface AddValueToAbility extends AddValueToFeature {
  type: "addValueToAbility";
  value: number;
  toWhichFeature: Ability[];
}

interface AddValueToSkill extends AddValueToFeature {
  type: "addValueToSkill";
  value: number;
  toWhichFeature: SkillPropName[];
}

interface AddValueBasedOnLevel extends BaseModification {
  type: "addValueBasedOnLevel";
  valueOnLevel: ValueBasedOnLevel;
  levelRef: TargetInterface;
}

interface AddDamageType extends BaseModification {
  type: "addDamageType";
  damageType: DamageTypes;
}

interface AddProficiency extends BaseModification {
  type: "addProficiency";
  addProficiencyTo: SkillPropName[];
}

interface AddFeat extends BaseModification {
  type: "addFeat";
  level: Level;
  featType?: FeatType;
}

interface IncreaseMaxLimit extends BaseModification {
  type: "increaseMaxLimit",
  toWhichAbility: Ability[]
  newMaxValue: number
}

export type HasDiceRoll = Extract<
  EventCounterProp,
  { diceRoll: TargetInterface[] }
>;

export function hasDiceRoll(event: EventCounterProp): event is HasDiceRoll {
  return "diceRoll" in event;
}

export type ModificationsProp =
  | ChangeDiceMod
  | ChangeDiceBasedOnLevel
  | AddDiceCounter
  | AddDiceBasedOnLevelCounter
  | AddDiceTrackerWithValuesCounter
  | AddTurnEconomy
  | ChangeDescriptionTurnEconomy
  | ChangeAbilityReference
  | AddAbility
  | AddTracerCounter
  | AddTracerTrackerCounter
  | AddValueTrackerCounter
  | AddDifficultyClassCounter
  | AddValue
  | AddValueToAbility
  | AddValueToSkill
  | AddValueBasedOnLevel
  | AddDamageType
  | AddEventCounter
  | AddEventWithTriggerCounter
  | AddContinousEventWithTriggerCounter
  | AddThrowingDiceEventTrackerCounter
  | AddProficiency
  | AddFeat
  | IncreaseMaxLimit;
