import type { Character } from "../types/character.types";
import type { SkillProp, TurnEconomyProp } from "../types/characterUtils.type";
import type { CountersInterface } from "../types/counters.types";

import {
  type ModificationsProp,
} from "../types/ModificationProps.type";
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
    mod: Extract<ModificationsProp, {type: "addDiceBasedOnLevelCounter"}>
  }
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
  addThrowingDiceEventTrackingCounter: {
    character: Character;
    target: CountersInterface[];
    mod: Extract<
      ModificationsProp,
      { type: "addThrowingDiceEventTrackerCounter" }
    >;
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
  addTurnEconomy: {
    character: Character;
    target: TurnEconomyProp[];
    mod: Extract<ModificationsProp, { type: "addTurnEconomy" }>;
  };
  changeDescriptionTurnEconomy: {
    character: Character;
    target: TurnEconomyProp[];
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
  addValue: {
    character: Character;
    target: HasScoresWithTracking ;
    mod: Extract<ModificationsProp, { type: "addValue" }>;
  };
  addDamageType: {
    character: Character;
    target: HasDamageTypes ;
    mod: Extract<ModificationsProp, { type: "addDamageType" }>;
  };
  addProficiency: {
    character: Character;
    target: SkillProp[];
    mod: Extract<ModificationsProp, { type: "addProficiency" }>;
  };
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
};
