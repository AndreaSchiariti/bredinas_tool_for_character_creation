import type { ClassFeatureDescription } from "./characterClassesUtils.types";
import type { ModificationLimitation } from "./trackModifications.types";
import type { EventCounterProp } from "./EventCounterProp.type";
import type {
  DiceInterface,
  Level,
  LevelKey,
  ModifyValue,
} from "./generalRules.types";
import type { TargetInterface } from "./targets.types";
import type { CharacterTurnEconomy } from "./characterUtils.type";
import type {
  Ability,
  SkillPropName,
} from "./features.type.ts/abilitiesAndSkills.type";
import type { DamageTypes } from "./features.type.ts/damageTypes.type";
import type { FeatType } from "./features.type.ts/feat.type";
import type { Rest } from "./features.type.ts/rests.type";
import type { CharacterClassesName } from "./features.type.ts/classes.type";
import type { DifficultyClassCalculatorMap } from "../rules/difficultyClassCalculator";

interface BaseModification {
  name: string;
  source: CharacterClassesName;
  targets: TargetInterface[];
  limitations?: ModificationLimitation[];
  isActive: boolean;
}

export type FeaturesForAdvantage = (SkillPropName | Ability)[];

export type DiceBasedOnLevel = Record<LevelKey, DiceInterface>;

export type ValueBasedOnLevel = Record<LevelKey, number>;

interface UsesDice extends BaseModification {
  dice: DiceInterface;
}

interface UsesUsagesAndReplanish extends BaseModification {
  usages: number;
  replenish: Rest;
}

interface UsesDiceBasedOnLevel extends BaseModification {
  diceOnLevel: DiceBasedOnLevel;
  levelRef: TargetInterface;
}

interface UsesValueBasedOnLevel extends BaseModification {
  valueOnLevel: ValueBasedOnLevel;
  levelRef: TargetInterface;
}

interface UsesAbility extends BaseModification {
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

interface AddTracerBasedOnLevelCounter extends BaseModification {
  type: "addTracerBasedOnLevelCounter";
  usageOnLevel: ValueBasedOnLevel;
  levelRef: TargetInterface;
  replenish: Rest;
  additionalReplenish?: {replenish: Rest, value: number}
}

interface AddTracerTrackerCounter extends BaseModification {
  type: "addTracerTrackerCounter";
  replenish: Rest;
  targetsToTrack: TargetInterface[];
}

interface AddEventCounterBase extends BaseModification {
  events: EventCounterProp[];
  limitationsToEvent?: ModificationLimitation[];
}

interface AddEventCounter
  extends BaseModification, UsesUsagesAndReplanish, AddEventCounterBase {
  type: "addEventCounter";
}

interface AddEventWithTriggerCounter extends AddEventCounterBase {
  type: "addEventWithTriggerCounter";
  trigger: string;
}

interface AddContinuousEventWithTriggerCounter extends AddEventCounterBase {
  type: "addContinuousEventWithTriggerCounter";
  trigger: string;
}

interface AddTracerEventCounter
  extends AddEventCounterBase, UsesUsagesAndReplanish {
  type: "addTracerEventCounter";
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
  actionType: keyof CharacterTurnEconomy;
}

interface ChangeDescriptionTurnEconomy extends BaseModification {
  type: "changeDescriptionTurnEconomy";
  description: ClassFeatureDescription[];
  originalDescription: ClassFeatureDescription[];
  actionId: string;
  actionType: keyof CharacterTurnEconomy;
}

interface ChangeAbilityReference extends BaseModification {
  type: "changeAbilityReference";
  ability: Ability;
}

interface AddAbility extends UsesAbility {
  type: "addAbility";
}

interface AddAbilityToSkill extends UsesAbility {
  type: "addAbilityToSkill";
  toWhichSkill: SkillPropName[];
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

interface AddValueBasedOnLevel extends UsesValueBasedOnLevel {
  type: "addValueBasedOnLevel";
}

interface AddValueBasedOnLevelCounter extends UsesValueBasedOnLevel {
  type: "addValueBasedOnLevelCounter";
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
  type: "increaseMaxLimit";
  toWhichAbility: Ability[];
  newMaxValue: number;
}

interface AddWeaponMasteryBasedOnLevel extends UsesValueBasedOnLevel {
  type: "addWeaponMasteryBasedOnLevel";
}

interface AddAdvantage extends BaseModification {
  type: "addAdvantage";
  features: FeaturesForAdvantage;
}

interface AddProficiencyWithChoice extends BaseModification {
  type: "addProficiencyWithChoice";
  skillsToChoose: SkillPropName[];
  howMany: number;
}

type DifficultyClassToShow =
  | {
      difficultyClassRef: TargetInterface;
      dcValue?: never;
      dcCalculatorType?: keyof DifficultyClassCalculatorMap;
    }
  | {
      dcValue: number;
      difficultyClassRef?: never;
      dcCalculatorType?: keyof DifficultyClassCalculatorMap;
    };

interface BaseOpenIsHealingWhenHP extends BaseModification {
  type: "openIsHealingWhenHP";
  message: string;
  hasDifficultyClassToShow?: DifficultyClassToShow;
}

type OpenIsHealingTrigger =
  | {
      triggeringModifyHp: ModifyValue;
      triggeringHpValue?: never;
    }
  | {
      triggeringModifyHp?: never;
      triggeringHpValue: number;
    };

type OpenIsHealingHealingValue =
  | {
      healingValueRef: TargetInterface;
      modifyHealingRef?: ModifyValue;
      healingValue?: never;
    }
  | {
      healingValueRef?: never;
      modifyHealingRef?: never;
      healingValue: number;
    };

type OpenIsHealingWhenHp = BaseOpenIsHealingWhenHP &
  OpenIsHealingTrigger &
  OpenIsHealingHealingValue;

interface AddCountingCounter extends BaseModification {
  type: "addCountingCounter";
  startingValue: number;
  reset: Rest;
}

interface SetAbilityAsMinimumTotalToSkillBasedOnAbility extends BaseModification {
  type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility";
  abilityScore: TargetInterface
  skillsAbilityAffected: Ability[]
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
  | AddAbilityToSkill
  | AddTracerCounter
  | AddTracerBasedOnLevelCounter
  | AddTracerTrackerCounter
  | AddValueTrackerCounter
  | AddDifficultyClassCounter
  | AddValue
  | AddValueToAbility
  | AddValueToSkill
  | AddValueBasedOnLevel
  | AddValueBasedOnLevelCounter
  | AddDamageType
  | AddEventCounter
  | AddEventWithTriggerCounter
  | AddContinuousEventWithTriggerCounter
  | AddTracerEventCounter
  | AddProficiency
  | AddFeat
  | IncreaseMaxLimit
  | AddWeaponMasteryBasedOnLevel
  | AddAdvantage
  | AddProficiencyWithChoice
  | OpenIsHealingWhenHp
  | AddCountingCounter
  | SetAbilityAsMinimumTotalToSkillBasedOnAbility;

const modificationPropsType = new Set<ModificationsProp["type"]>([
  "changeDice",
  "changeDiceBasedOnLevel",
  "addDiceCounter",
  "addDiceBasedOnLevelCounter",
  "addDiceTrackerWithValuesCounter",
  "addTracerCounter",
  "addTracerBasedOnLevelCounter",
  "addTracerTrackerCounter",
  "addEventCounter",
  "addEventWithTriggerCounter",
  "addContinuousEventWithTriggerCounter",
  "addTracerEventCounter",
  "addValueTrackerCounter",
  "addDifficultyClassCounter",
  "addTurnEconomy",
  "changeDescriptionTurnEconomy",
  "changeAbilityReference",
  "addAbility",
  "addAbilityToSkill",
  "addValue",
  "addValueToAbility",
  "addValueToSkill",
  "addValueBasedOnLevel",
  "addValueBasedOnLevelCounter",
  "addDamageType",
  "addProficiency",
  "addFeat",
  "increaseMaxLimit",
  "addWeaponMasteryBasedOnLevel",
  "addAdvantage",
  "openIsHealingWhenHP",
  "addCountingCounter",
  "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility"
]);

export function isModificationProp(data: unknown): data is ModificationsProp {
  if (data === null || typeof data !== "object") {
    return false;
  }

  const mod = data as {
    name: unknown;
    type: unknown;
    isActive: unknown;
  };

  const hasNameAndIsActive =
    typeof mod.name === "string" && typeof mod.isActive === "boolean";
  const hasType =
    typeof mod.type === "string" &&
    modificationPropsType.has(mod.type as ModificationsProp["type"]);

  return hasNameAndIsActive && hasType;
}
