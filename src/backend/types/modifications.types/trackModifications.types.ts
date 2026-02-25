import type { Ability } from "../features.types/abilitiesAndSkills.type";
import type { Condition } from "../features.types/conditions.type";
import type { DamageTypes } from "../features.types/damageTypes.type";
import type {
  CharacterClassesName,
  SpellcastingClassesName,
} from "../features.types/classes";
import type { ExchangableFeatureWithSpellSlot } from "../features.types/spells.type";
import type {
  ArmorType,
  CoreWeaponProficiency,
} from "../features.types/items.type";
import type { LimitationsMap } from "../../rules/limitations/limitationResolver";
import type { ModificationTypeMap } from "../../rules/modifications/modificationTypeResolver";
import type { ConditionalTargetMap } from "../../rules/target/conditionalTargetResolver";
import type { DirectTargetMap } from "../../rules/target/directTargetResolver";
import type { DiceInterface } from "../generalRules.types/dice.types";


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
  value: number;
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

interface AddValueToAllNotProficientSkillsModification extends HasValueModifications {
  type: "addValueToAllNotProficientSkills";
}

interface AddExchangeToSpellcastingModification extends BaseTrackModifications {
  type: "addExchangeToSpellcasting";
  exchange: ExchangableFeatureWithSpellSlot;
}

interface AddClassSpellListModification extends BaseTrackModifications {
  type: "addClassSpellList";
  classSpellList: CharacterClassesName;
}

interface AddSpellToClassSpellListModification extends BaseTrackModifications {
  type: "addSpellToClassSpellList";
}

interface AddProficiencyToArmorModification extends BaseTrackModifications {
  type: "addProficiencyToArmor";
  armorType: ArmorType;
}

interface AddProficiencyToWeaponModification extends BaseTrackModifications {
  type: "addProficiencyToWeapon";
  weaponProficiency: CoreWeaponProficiency;
}

interface addExtraCantripKnownToClassModification extends BaseTrackModifications {
  type: "addExtraCantripKnownToClass";
  quantity: number;
  classSpellList: SpellcastingClassesName[];
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
  | AddValueToAllNotProficientSkillsModification
  | AddExchangeToSpellcastingModification
  | AddClassSpellListModification
  | AddSpellToClassSpellListModification
  | AddProficiencyToArmorModification
  | AddProficiencyToWeaponModification
  | addExtraCantripKnownToClassModification;

export const trackModificationsTypeSet = new Set<TrackModifications["type"]>([
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
  "addExchangeToSpellcasting",
  "addClassSpellList",
  "addSpellToClassSpellList",
  "addProficiencyToArmor",
  "addProficiencyToWeapon",
  "addExtraCantripKnownToClass",
]);










