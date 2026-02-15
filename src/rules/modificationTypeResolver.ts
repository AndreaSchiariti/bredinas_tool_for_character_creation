import type { Character } from "../types/character.types";
import type {
  CharacterTurnEconomy,
  CharacterWeaponMastery,
  Hp,
} from "../types/characterUtils.type";

import type { CountersInterface } from "../types/counters.types";
import type {
  AbilityProp,
  CharacterSkills,
} from "../types/features.type.ts/abilitiesAndSkills.type";
import type { CharacterFeats } from "../types/features.type.ts/feat.type";

import { type ModificationsProp } from "../types/ModificationProps.type";
import {
  type HasAbilitiesWithTracking,
  type HasCurrentAndBaseDiceWithTracking,
  type HasDamageTypes,
  type HasScoresWithTracking,
} from "../types/targets.types";
import { abilityAndSkillTypeResolver } from "./modificationTypeResolver/abilityAndSkillTypeResolver";
import { diceTypeResolver } from "./modificationTypeResolver/diceTypeResolver";
import { eventCounterTypeResolver } from "./modificationTypeResolver/eventCounterTypeResolver";
import { generalAddingTypeResolver } from "./modificationTypeResolver/generalAddingTypeResolver";
import { generalCounterTypeResolver } from "./modificationTypeResolver/generalCounterTyperResolver";
import { openingMessageTypeResolver } from "./modificationTypeResolver/openingMessageTypeResolver";
import { turnEconomyTypeResolver } from "./modificationTypeResolver/turnEconomyTypeResolver";

export interface ModificationTypeMap {
  changeDice: {
    character: Character;
    target: HasCurrentAndBaseDiceWithTracking;
    mod: Extract<ModificationsProp, { type: "changeDice" }>;
  };
  changeDiceBasedOnLevel: {
    character: Character;
    target: HasCurrentAndBaseDiceWithTracking;
    mod: Extract<ModificationsProp, { type: "changeDiceBasedOnLevel" }>;
  };
  addDiceCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addDiceCounter" }>;
  };
  addDiceBasedOnLevelCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addDiceBasedOnLevelCounter" }>;
  };
  addDiceTrackerWithValuesCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<
      ModificationsProp,
      { type: "addDiceTrackerWithValuesCounter" }
    >;
  };
  addTracerCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addTracerCounter" }>;
  };
  addTracerBasedOnLevelCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addTracerBasedOnLevelCounter" }>;
  };
  addTracerTrackerCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addTracerTrackerCounter" }>;
  };
  addDifficultyClassCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addDifficultyClassCounter" }>;
  };
  addEventCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addEventCounter" }>;
  };
  addTracerEventCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addTracerEventCounter" }>;
  };
  addEventWithTriggerCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addEventWithTriggerCounter" }>;
  };
  addValueTrackerCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addValueTrackerCounter" }>;
  };
  addValueBasedOnLevelCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addValueBasedOnLevelCounter" }>;
  };
  addContinuousEventWithTriggerCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<
      ModificationsProp,
      { type: "addContinuousEventWithTriggerCounter" }
    >;
  };
  addTurnEconomy: {
    character: Character;
    target: CharacterTurnEconomy;
    mod: Extract<ModificationsProp, { type: "addTurnEconomy" }>;
  };
  changeDescriptionTurnEconomy: {
    character: Character;
    target: CharacterTurnEconomy;
    mod: Extract<ModificationsProp, { type: "changeDescriptionTurnEconomy" }>;
  };
  //changeAbilityReference: {
  //  character: Character;
  //  target: HasSingleAbilityWithTracking;
  //  mod: Extract<ModificationsProp, { type: "changeAbilityReference" }>;
  //};
  addAbility: {
    character: Character;
    target: HasAbilitiesWithTracking;
    mod: Extract<ModificationsProp, { type: "addAbility" }>;
  };
  addAbilityToSkill: {
    character: Character;
    target: CharacterSkills;
    mod: Extract<ModificationsProp, { type: "addAbilityToSkill" }>;
  };
  addValue: {
    character: Character;
    target: HasScoresWithTracking;
    mod: Extract<ModificationsProp, { type: "addValue" }>;
  };
  addValueToAbility: {
    character: Character;
    target: AbilityProp[];
    mod: Extract<ModificationsProp, { type: "addValueToAbility" }>;
  };
  addValueToSkill: {
    character: Character;
    target: CharacterSkills;
    mod: Extract<ModificationsProp, { type: "addValueToSkill" }>;
  };
  addValueBasedOnLevel: {
    character: Character;
    target: HasScoresWithTracking;
    mod: Extract<ModificationsProp, { type: "addValueBasedOnLevel" }>;
  };
  addDamageType: {
    character: Character;
    target: HasDamageTypes;
    mod: Extract<ModificationsProp, { type: "addDamageType" }>;
  };
  addProficiency: {
    character: Character;
    target: CharacterSkills;
    mod: Extract<ModificationsProp, { type: "addProficiency" }>;
  };
  addFeat: {
    character: Character;
    target: CharacterFeats;
    mod: Extract<ModificationsProp, { type: "addFeat" }>;
  };
  increaseMaxLimit: {
    character: Character;
    target: AbilityProp[];
    mod: Extract<ModificationsProp, { type: "increaseMaxLimit" }>;
  };
  addWeaponMasteryBasedOnLevel: {
    character: Character;
    target: CharacterWeaponMastery | null;
    mod: Extract<ModificationsProp, { type: "addWeaponMasteryBasedOnLevel" }>;
  };
  addAdvantage: {
    character: Character;
    target: CharacterSkills;
    mod: Extract<ModificationsProp, { type: "addAdvantage" }>;
  };
  addProficiencyWithChoice: {
    character: Character;
    target: CharacterSkills;
    mod: Extract<ModificationsProp, { type: "addProficiencyWithChoice" }>;
  };
  openIsHealingWhenHP: {
    character: Character;
    target: Hp;
    mod: Extract<ModificationsProp, { type: "openIsHealingWhenHP" }>;
  };
  addCountingCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<ModificationsProp, { type: "addCountingCounter" }>;
  };
  setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility: {
    character: Character;
    target: CharacterSkills;
    mod: Extract<
      ModificationsProp,
      { type: "setAbilityScoreAsMinimumTotalToSkillsBasedOnAbility" }
    >;
  };
  addExpertiseToProficiencyWithChoice: {
    character: Character;
    target: CharacterSkills;
    mod: Extract<
      ModificationsProp,
      { type: "addExpertiseToProficiencyWithChoice" }
    >;
  };
  addValueToAllNotProficientSkills: {
    character: Character,
  target: CharacterSkills,
  mod: Extract<ModificationsProp, { type: "addValueToAllNotProficientSkills" }>,
  }
}

export type ModificationTypeResolver = {
  [K in keyof ModificationTypeMap]: {
    apply: (
      character: Character,
      target: ModificationTypeMap[K]["target"],
      mod: ModificationTypeMap[K]["mod"],
    ) => ModificationTypeMap[K]["target"];

    revert: (
      character: Character,
      target: ModificationTypeMap[K]["target"],
      mod: ModificationTypeMap[K]["mod"],
    ) => ModificationTypeMap[K]["target"];
  };
};

export const modificationTypeResolver: ModificationTypeResolver = {
  ...diceTypeResolver,
  ...generalCounterTypeResolver,
  ...eventCounterTypeResolver,
  ...turnEconomyTypeResolver,
  ...abilityAndSkillTypeResolver,
  ...generalAddingTypeResolver,
  ...openingMessageTypeResolver,
};
