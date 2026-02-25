import type { Character } from "../../types/character.types/character.types";
import type { Ability, AbilityProp } from "../../types/features.types/abilitiesAndSkills.type";
import type { CharacterClassesName } from "../../types/features.types/classes";
import type { Condition, ConditionProp } from "../../types/features.types/conditions.type";
import type { DiceInterface } from "../../types/generalRules.types/dice.types";
import { type CountersInterface, isDiceCounter } from "../../types/modifications.types/counters.types";
import type { ConditionalTargetInterface } from "../../types/targets.types/targets.types";
import  { devConsoleWarn } from "../../utils/general";


export interface ConditionalTargetMap {
  abilityModifier: {
    condition: Ability;
    value: number;
  };
  classLevel: {
    condition: CharacterClassesName;
    value: number;
  };
  counterDiceById: {
    condition: string;
    value: DiceInterface | null;
  };
  counterById: {
    condition: string;
    value: CountersInterface | null;
  };
  conditionByName: {
    condition: Condition;
    value: ConditionProp | null;
  };
  abilityCurrentScore: {
    condition: Ability;
    value: number;
  };
}

type ConditionalTargetResolver = {
  [K in keyof ConditionalTargetMap]: (
    character: Character,
    condition: ConditionalTargetMap[K]["condition"],
  ) => ConditionalTargetMap[K]["value"];
};

function findAbilityModifier(character: Character, condition: Ability): number {
  const ability: AbilityProp | undefined = character.abilities.find(
    (ability) => ability.name === condition,
  );

  if (!ability) {
    devConsoleWarn(`Couldn't find ${condition} modifier`, character.abilities);
    return 0;
  }

  return ability.modifier;
}

function findClassLevel(
  character: Character,
  condition: CharacterClassesName,
): number {
  const characterClass = character.classes.find(
    (element) => element.name === condition,
  );

  if (!characterClass) {
    devConsoleWarn(
      `Class ${condition} not found for character`,
      character.classes,
    );

    return 0;
  }
  return characterClass.level;
}

function findCounterDiceById(
  character: Character,
  condition: string,
): DiceInterface | null {
  const counter: CountersInterface | undefined = character.counters.find(
    (counter) => counter.id === condition,
  );

  if (!counter) {
    devConsoleWarn(
      `Counter ${condition} not found on character`,
      character.counters,
    );

    return null;
  }

  if (!isDiceCounter(counter)) {
    devConsoleWarn(`Counter ${counter.name} has no dice property`, counter);

    return null;
  }

  return counter.dice;
}

function findCounterById(
  character: Character,
  condition: string,
): CountersInterface | null {
  const counterToFetch = character.counters.find(
    (counter) => counter.id === condition,
  );

  return counterToFetch ? counterToFetch : null;
}

function findConditionByName(
  character: Character,
  condition: Condition,
): ConditionProp | null {
  const conditionToFetch = character.conditions.conditionsList.find(
    (singleCondition) => singleCondition.name === condition,
  );

  return conditionToFetch ? conditionToFetch : null;
}

function findAbilityCurrentScoreByAbility(
  character: Character,
  condition: Ability,
): number {
  const ability = character.abilities.find((ab) => ab.name === condition);

  if (!ability) {
    devConsoleWarn(
      `couldn't find the ability by name in target "abilityCurrentScore"`,
      condition,
    );
    return 0;
  }
  const currentScore = ability.currentScore;

  return currentScore;
}

export const conditionalTargetResolver: ConditionalTargetResolver = {
  abilityModifier: findAbilityModifier,
  classLevel: findClassLevel,
  counterDiceById: findCounterDiceById,
  counterById: findCounterById,
  conditionByName: findConditionByName,
  abilityCurrentScore: findAbilityCurrentScoreByAbility,
};

export function getConditionalTarget<K extends keyof ConditionalTargetMap>(
  character: Character,
  target: ConditionalTargetInterface<K>,
): ConditionalTargetMap[K]["value"] {
  return conditionalTargetResolver[target.target](character, target.condition);
}

const conditionalTargetList: (keyof ConditionalTargetMap)[] = [
  "abilityModifier",
  "classLevel",
  "counterDiceById",
  "counterById",
  "conditionByName",
  "abilityCurrentScore",
];

export const conditionalTargetSet = new Set<keyof ConditionalTargetMap>(
  conditionalTargetList,
);
