import type { Ability, DamageTypes, Replenish } from "../rules/arrayOfFeatures";
import type {
  CharacterClassesName,
  ClassFeatureDescription,
} from "./characterClassesUtils.types";
import type {
  ModificationLimitation,
  TrackModifications,
} from "./trackModifications.types";
import type { SkillPropName } from "./characterUtils.type";
import type { EventCounterProp } from "./EventCounterProp.type";
import type { DiceInterface } from "./generalRules.types";
import type { TargetInterface } from "./targets.types";

interface BaseModification {
  name: string;
  source: CharacterClassesName;
  targets: TargetInterface[];
  limitations: ModificationLimitation[];
  isActive: boolean;
}

export type Level =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

type LevelKey = `level${Level}`;

export function isLevel(value: unknown): value is Level {
  return (
    typeof value == "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 20
  );
}

export type DiceBasedOnLevel = Record<LevelKey, DiceInterface>;

export type ValueBasedOnLevel = Record<LevelKey, number>;

interface UsesDice extends BaseModification {
  dice: DiceInterface;
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

interface AddTracerCounter extends BaseModification {
  type: "addTracerCounter";
  usages: number;
  replenish: Replenish;
}

interface AddTracerTrackerCounter extends BaseModification {
  type: "addTracerTrackerCounter";
  replenish: Replenish;
  targetsToTrack: TargetInterface[];
}

interface AddEventCounterBase {
  events: EventCounterProp[];
  replenish: Replenish;
  usages: number;
}

interface AddEventCounter extends BaseModification, AddEventCounterBase {
  type: "addEventCounter";
}

interface AddEventWithTriggerCounter extends BaseModification {
  type: "addEventWithTriggerCounter";
  events: EventCounterProp[];
  trigger: string;
}

interface AddThrowingDiceEventTrackerCounter
  extends BaseModification, AddEventCounterBase {
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
  | AddValueBasedOnLevel
  | AddDamageType
  | AddEventCounter
  | AddEventWithTriggerCounter
  | AddThrowingDiceEventTrackerCounter
  | AddProficiency;
